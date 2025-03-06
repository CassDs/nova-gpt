const crypto = require('node:crypto').webcrypto;
global.crypto = crypto;

// Garantir que o Buffer esteja disponível
const { Buffer } = require('buffer');
global.Buffer = Buffer;

module.exports = crypto;