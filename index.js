require('dotenv').config();
const express = require('express');
const webhookController = require('./src/controllers/webhookController');
const whatsappService = require('./src/services/whatsappService');

const app = express();
app.use(express.json());

// Ruta para verificar el webhook con Meta
app.get('/webhook', webhookController.verify);

// Ruta que recibe los mensajes reales desde WhatsApp
app.post('/webhook', webhookController.handleMessage);

// 🔥 ESTA RUTA ES LA QUE NECESITÁS para probar desde curl o Postman
app.post('/send', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Faltan campos: to y message' });
  }

  await whatsappService.sendMessage(to, message);
  res.send('Mensaje enviado (o al menos intentado 😄)');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
<<<<<<< HEAD
}); //cambio git
=======
});
>>>>>>> e35157a53249623cf3d7dcb40e41df09441b7090
