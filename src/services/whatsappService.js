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
  const to = formatPhoneNumber(from);

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

    // 🔁 Lógica de navegación por estados
    switch (estado) {
      case 'inicio':
        sendMessage(to, `¡Hola! Seleccioná una opción:
1️⃣ Cotizar seguros
2️⃣ Dudas frecuentes
3️⃣ Salir`);
        db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['menu_respuesta', from]);
        break;

      case 'menu_respuesta':
        if (msgBody === '1') {
          sendMessage(to, `¿Qué tipo de seguro querés cotizar?
1️⃣ Auto
2️⃣ Moto
3️⃣ Camión
4️⃣ Hogar
5️⃣ Volver atrás
6️⃣ Salir`);
          db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['cotizar_tipo', from]);
        } else if (msgBody === '2') {
          sendMessage(to, `Dudas frecuentes:
- ¿Cuánto demora una cotización?
- ¿Qué datos necesito?
- ¿Puedo asegurar vehículos extranjeros?

Escribí "5" para volver o "6" para salir.`);
        } else if (msgBody === '3' || msgBody === 'salir') {
          sendMessage(to, '¡Hasta pronto! 👋');
          db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['inicio', from]);
        } else {
          sendMessage(to, 'Por favor respondé con 1, 2 o 3.');
        }
        break;

      case 'cotizar_tipo':
        if (['1', '2', '3', '4'].includes(msgBody)) {
          const tipos = {
            '1': 'auto',
            '2': 'moto',
            '3': 'camión',
            '4': 'hogar'
          };
          const tipo = tipos[msgBody];
          db.query('UPDATE usuarios SET tipo_seguro = ?, estado = ? WHERE telefono = ?', [tipo, 'cotizar_dato', from]);
          sendMessage(to, `Perfecto, cotización de ${tipo}. ¿Podés darme un dato más? (ej: año del vehículo, zona, etc.)`);
        } else if (msgBody === '5') {
          sendMessage(to, `Volviendo al menú principal...`);
          db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['menu_respuesta', from]);
        } else if (msgBody === '6') {
          sendMessage(to, '¡Hasta pronto! 👋');
          db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['inicio', from]);
        } else {
          sendMessage(to, 'Opción no válida. Elegí del 1 al 6.');
        }
        break;

      case 'cotizar_dato':
        db.query('UPDATE usuarios SET dato_extra = ?, estado = ? WHERE telefono = ?', [msgBody, 'menu_respuesta', from]);
        sendMessage(to, `¡Gracias! Ya tengo todo lo que necesito. En breve te contactará un asesor 🙌

¿Querés hacer otra cosa?
1️⃣ Cotizar seguros
2️⃣ Dudas frecuentes
3️⃣ Salir`);
        break;

      default:
        sendMessage(to, `No entendí eso. Vamos al inicio:
1️⃣ Cotizar seguros
2️⃣ Dudas frecuentes
3️⃣ Salir`);
        db.query('UPDATE usuarios SET estado = ? WHERE telefono = ?', ['menu_respuesta', from]);
        break;
    }
  });
};


module.exports = { handleIncomingMessage, sendMessage };
