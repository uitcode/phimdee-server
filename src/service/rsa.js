const NodeRSA = require('node-rsa');

const publishSSHRASKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANSNULRbYvCQyBODx/wGRoI9FybzRPqG
SvN5eX1HQHQd59a4TRZjWr/ypp5ScRi56JZia8NXLOYRjD1PDRJQL2ECAwEAAQ==
-----END PUBLIC KEY-----
`;

const privateSSHRASKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBPQIBAAJBANSNULRbYvCQyBODx/wGRoI9FybzRPqGSvN5eX1HQHQd59a4TRZj
Wr/ypp5ScRi56JZia8NXLOYRjD1PDRJQL2ECAwEAAQJBAL6iXB7W0/9FK11tVUEx
860903UIvPYg2jpS2ebFsAYzZWXIpoAfyNB+XzFU0LEQaMzA6qMTUj2JJIgLpIaa
BwECIQD0gj59hfM4Re4ZcjVEdCLspefQpirx7ItbYV1CQql70QIhAN6KlxX7TGDB
lC+oG/ao2C77lPHutwqAOR+jMtYK2a6RAiEAt+9GvTzII/wPSpss0Ssgnq+LvN1U
DxwoFX0gH9lwEBECIQCn57sc27EB46xR1K3cigIqWKlFbI3wP1RaOYD2m9Mn8QIh
ALOIeBVQElocS92U4qkvSuG4CrN6rTEpinGHGOkNdCRU
-----END RSA PRIVATE KEY-----
`;

const key = new NodeRSA({b: 512});
key.setOptions({encryptionScheme: 'pkcs1'});
key.importKey(publishSSHRASKey, 'pkcs8-public');
key.importKey(privateSSHRASKey, 'pkcs1-private');

const encodeRSA = (data) => {
  return key.encrypt(data, 'base64');
}

const decodeRSA = (data) => {
  return key.decrypt(encrypted, 'utf8');
}

module.exports = {
  encodeRSA,
  decodeRSA
}