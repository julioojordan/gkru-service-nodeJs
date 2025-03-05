const { verifyToken } = require("../authentication/authentication");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.substring(7); // Menghilangkan "Bearer "

  try {
    const decoded = await verifyToken(token, req.app);
    req.user = decoded; // Simpan data user di request >> kenapa perlu disimpan ya chatgpt(?)
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
}

module.exports = authMiddleware;
