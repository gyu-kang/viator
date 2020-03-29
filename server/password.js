const crypto = require("crypto");

const config = {
  saltBytes: 64,
  iterations: 100000,
  keyLength: 64,
  digest: "sha512",
};

module.exports = {
  verify: (enteredPassword, passwordSalt, password) => {
    const derivedKey = crypto
      .pbkdf2Sync(
        enteredPassword,
        passwordSalt,
        config.iterations,
        config.keyLength,
        config.digest
      )
      .toString("hex");
    return derivedKey === password;
  },
  hash: async (password, salt) => {
    return crypto
      .pbkdf2Sync(
        password,
        salt,
        config.iterations,
        config.keyLength,
        config.digest
      )
      .toString("hex");
  },
  generateSalt: async () => {
    const randomBytes = await crypto.randomBytes(config.saltBytes);
    return randomBytes.toString("hex");
  },
};
