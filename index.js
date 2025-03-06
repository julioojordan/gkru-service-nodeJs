const express = require("express");
const mysql = require("mysql2/promise");
const winston = require("winston");
const { setupRoutes } = require("./src/routes/setupRoutes");
const { DataWilayahRepository, UserRepository, DataLingkunganRepository } = require("./src/repositories");
const { DataWilayahService, UserService, DataLingkunganService } = require("./src/services");
const { DataWilayahController, UserController, DataLingkunganController } = require("./src/controllers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// === Setup Logger ===
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.info("Starting server...");

// === Load Private Key Sekali Saat Startup ===
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
if (!privateKeyPath) {
  logger.error("PRIVATE_KEY_PATH tidak diset di .env. Aplikasi dihentikan.");
  process.exit(1);
}

let privateKey;
try {
  privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");
  logger.info("✅ Private key berhasil dimuat.");
} catch (err) {
  logger.error("❌ Gagal membaca private key:", err.message);
  process.exit(1);
}

// === Setup Database Connection (Async) ===
async function initDatabase() {
  try {
    const db = await mysql.createPool({
      host: "localhost",
      user: "root",
      password: "root",
      database: "gkru_app",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test Connection
    const connection = await db.getConnection();
    logger.info("✅ Database connected successfully");
    connection.release();

    return db;
  } catch (err) {
    logger.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

// === Start Server Function ===
async function startServer() {
  const db = await initDatabase();

  const app = express();

  // Set global values
  app.set("privateKey", privateKey);
  app.set("logger", logger);
  app.set("db", db);

  // Middleware
  app.use(express.json());

  app.use((req, res, next) => {
    req.app.locals.logger = app.get("logger");
    req.app.locals.db = app.get("db");
    req.app.locals.privateKey = app.get("privateKey");
    next();
  });

  app.use((req, res, next) => {
    const dataWilayahRepository = new DataWilayahRepository();
    const dataWilayahService = new DataWilayahService(
      dataWilayahRepository,
      req.app.locals.db
    );
    const dataWilayahController = new DataWilayahController(dataWilayahService);
    
    const dataLingkunganRepository = new DataLingkunganRepository();
    const dataLingkunganService = new DataLingkunganService(
      dataLingkunganRepository,
      req.app.locals.db
    );
    const dataLingkunganController = new DataLingkunganController(dataLingkunganService);

    const userRepository = new UserRepository();
    const userService = new UserService(
      userRepository,
      req.app.locals.db
    );
    const userController = new UserController(userService);
    
    req.app.locals.controllers = { dataWilayahController, userController, dataLingkunganController };
    next();
  });

  // Setup Routes
  setupRoutes(app, logger);

  // Start Server
  const PORT = 3001;
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

// Run the server
startServer();
