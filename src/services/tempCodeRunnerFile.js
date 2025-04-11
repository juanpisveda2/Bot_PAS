const axios = require('axios');
const db = require('../db/connection'); // Conexión a MySQL

// 👇 Formateador corregido para Argentina: elimina el 9 si está
const formatPhoneNumber = (phone) => {
  if (phone.startsWith("549")) {
    return "54" + phone.slice(3);
  }
  return phone;
};

// 👇 Función para enviar mensaje por WhatsApp
const sendMessage = async (to, body) => {
  try {
    const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: body },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Mensaje enviado:', response.data);
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error.response?.data || error.message);
  }
};

// 👇 Función principal que maneja los mensajes entrantes
const handleIncomingMessage = async (message) => {
  const from = message.from;
  const msgBody = message.text?.body?.toLowerCase().trim();
  const to = formatPhoneNumber(from); // Formateamos para responder

  console.log(`📩 Mensaje recibido de: ${from}`);
  console.log(`📤 Se va a responder al número: ${to}`);
  console.log(`📝 Mensaje recibido: ${msgBody}`);

  db.query('SELECT * FROM usuarios WHERE telefono = ?', [from], (err, results) => {
    if (err) {
      console.error('❌ Error al consultar la base de datos:', err.message);
      return;
    }

    let estado = 'inicio';

    if (results.length === 0) {
      console.log('🆕 Usuario nuevo, insertando en la base de datos');
      db.query('INSERT INTO usuarios (telefono, estado) VALUES (?, ?)', [from, 'inicio']);
    } else {
      estado = results[0].estado;
      console.log(`📊 Usuario existente, estado actual: ${estado}`);
    }

    // 🔁 Lógica de respuestas por estado
    if (estado === 'inicio') {
      if (msgBody.includes('cotizar')) {
        sendMessage(to, '¿Qué tipo de seguro querés? (auto, hogar, vida, etc.)');
        db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['esperando_tipo', from]);
      } else {
        sendMessage(to, 'Hola! Podés escribir "cotizar" para empezar 😊');
      }
    }

    else if (estado === 'esperando_tipo') {
      db.query(
        'UPDATE usuarios SET tipo_seguro = ?, estado = ? WHERE telefono = ?',
        [msgBody, 'esperando_dato_extra', from]
      );
      sendMessage(to, `Perfecto, cotización de "${msgBody}". ¿Podés darme un dato más? (ej: año del vehículo)`);
    }

    else if (estado === 'esperando_dato_extra') {
      db.query(
        'UPDATE usuarios SET dato_extra = ?, estado = ? WHERE telefono = ?',
        [msgBody, 'completo', from]
      );
      sendMessage(to, '¡Gracias! Ya tengo todo lo que necesito. En breve te contactará un asesor 🙌');
    }

    else {
      sendMessage(to, 'Si querés hacer otra cotización, escribí "cotizar" nuevamente.');
    }
  });
};

// 👇 Exportamos para usar en otros archivos
module.exports = { handleIncomingMessage, sendMessage };
