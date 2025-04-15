const whatsappService = require('../services/whatsappService');

const verify = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFICADO');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

const handleMessage = (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      whatsappService.handleIncomingMessage(message);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

module.exports = { verify, handleMessage };