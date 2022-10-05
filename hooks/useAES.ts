import "../shim.js";
import crypto, { createCipheriv, createDecipheriv } from "crypto";

export const useAES = () => {
  var encrypt = function (plain_text, encryptionMethod, secret, iv) {
    var encryptor = createCipheriv(encryptionMethod, secret, iv);
    return (
      encryptor.update(plain_text, "utf8", "base64") + encryptor.final("base64")
    );
  };

  var decrypt = function (encryptedMessage, encryptionMethod, secret, iv) {
    var decryptor = createDecipheriv(encryptionMethod, secret, iv);
    return (
      decryptor.update(encryptedMessage, "base64", "utf8") +
      decryptor.final("utf8")
    );
  };

  var textToEncrypt =
    new Date().toISOString() + "|My super secret information.";
  var encryptionMethod = "AES-256-CBC";
  var secret = "My32charPasswordAndInitVectorStr"; //must be 32 char length
  var iv = secret.substr(0, 16);

  var encryptedMessage = encrypt(textToEncrypt, encryptionMethod, secret, iv);
  var decryptedMessage = decrypt(
    encryptedMessage,
    encryptionMethod,
    secret,
    iv
  );

  return {};
};
