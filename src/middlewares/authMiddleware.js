const { verifyToken } = require("../authentication/authentication");
const handleError = require("../helpers/handleErrorHelper")
const createHttpError = require("http-errors");

async function authMiddleware(req, res, next) {
  const logger = req.app.locals.logger;
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err1 = createHttpError(401, "Unauthorized");
    logger.error("Unauthorized", { error: err1.message });
    return handleError(res, logger, err1);
  }

  const token = authHeader.substring(7); // Menghilangkan "Bearer "

  try {
    const decoded = await verifyToken(token, req.app);
    req.user = decoded; // Simpan data user di request >> kenapa perlu disimpan ya chatgpt(?)
    next();
  } catch (err) {
    logger.error("Unauthorized", { error: err });
    const error = createHttpError(401, "Unauthorized: Invalid token");
    return handleError(res, logger, error);
  }
}

module.exports = authMiddleware;
