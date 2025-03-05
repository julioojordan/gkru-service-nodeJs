const express = require("express");
const cors = require("cors");
const authMiddleware = require("../middlewares/authMiddleware");

const setupRoutes = (app, logger) => {
  // =========== SETUP MIDDLEWARE ===============
  app.use(cors()); // CORS middleware

  // =========== User ROUTES ===============
  app.post("/login", async (req, res) => {
    try {
      const { userController } = req.app.locals.controllers;
      await userController.findOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/user", authMiddleware, async (req, res) => {
    try {
      const { userController } = req.app.locals.controllers;
      await userController.findAll(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/user/add", authMiddleware, async (req, res) => {
    try {
      const { userController } = req.app.locals.controllers;
      await userController.add(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/user/:idUser/update", authMiddleware, async (req, res) => {
    try {
      const { userController } = req.app.locals.controllers;
      await userController.update(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/user/:idUser/delete", authMiddleware, async (req, res) => {
    try {
      const { userController } = req.app.locals.controllers;
      await userController.deleteOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // =========== WILAYAH ROUTES ===============
  app.patch("/wilayah/:idWilayah/update", authMiddleware, async (req, res) => {
    try {
      const { dataWilayahController } = req.app.locals.controllers;
      await dataWilayahController.update(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/wilayah/:idWilayah/delete", authMiddleware, async (req, res) => {
    try {
      const { dataWilayahController } = req.app.locals.controllers;
      await dataWilayahController.deleteOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/wilayah/getTotal", authMiddleware, async (req, res) => {
    try {
      const { dataWilayahController } = req.app.locals.controllers;
      await dataWilayahController.getTotalWilayah(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/wilayah/add", authMiddleware, async (req, res) => {
    try {
      const { dataWilayahController } = req.app.locals.controllers;
      await dataWilayahController.add(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/wilayah/:idWilayah", authMiddleware, async (req, res) => {
    try {
      const { dataWilayahController } = req.app.locals.controllers;
      await dataWilayahController.findOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/wilayah", async (req, res) => {
    try {
      const { dataWilayahController } = req.app.locals.controllers;
      return await dataWilayahController.findAll(req, res);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // ========== STATIC FILE ==============
  app.use("/uploads", express.static("uploads"));

  logger.info("Routes setup completed");
};

module.exports = { setupRoutes };
