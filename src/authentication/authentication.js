const jwt = require("jsonwebtoken");

// Fungsi untuk membuat token
function createToken(username, req) {
  return new Promise((resolve, reject) => {
    const privateKey = req.app.locals.privateKey;
    if (!privateKey) {
      return reject(new Error("Private key tidak tersedia"));
    }

    const payload = {
      username,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Expired 24 jam
    };

    jwt.sign(payload, privateKey, { algorithm: "HS256" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

// Fungsi untuk verifikasi token
function verifyToken(token, app) {
  return new Promise((resolve, reject) => {
    const privateKey = app.get("privateKey"); // Ambil dari global
    if (!privateKey) {
      return reject(new Error("Private key tidak tersedia"));
    }

    jwt.verify(token, privateKey, { algorithms: ["HS256"] }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = { createToken, verifyToken };
