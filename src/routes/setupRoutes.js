const express = require("express");
const cors = require("cors");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const setupRoutes = (app, logger) => {
  const upload = multer();
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

  // =========== LINGKUNGAN ROUTES ===============

  app.patch(
    "/lingkungan/:idLingkungan/update",
    authMiddleware,
    async (req, res) => {
      try {
        const { dataLingkunganController } = req.app.locals.controllers;
        await dataLingkunganController.update(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.delete(
    "/lingkungan/:idLingkungan/delete",
    authMiddleware,
    async (req, res) => {
      try {
        const { dataLingkunganController } = req.app.locals.controllers;
        await dataLingkunganController.deleteOne(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.post("/lingkungan/add", authMiddleware, async (req, res) => {
    try {
      const { dataLingkunganController } = req.app.locals.controllers;
      await dataLingkunganController.add(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/lingkungan/getTotal", authMiddleware, async (req, res) => {
    try {
      const { dataLingkunganController } = req.app.locals.controllers;
      await dataLingkunganController.getTotalLingkungan(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/lingkungan/:idLingkungan", authMiddleware, async (req, res) => {
    try {
      const { dataLingkunganController } = req.app.locals.controllers;
      await dataLingkunganController.findOneWithParam(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/lingkungan", authMiddleware, async (req, res) => {
    try {
      const { dataLingkunganController } = req.app.locals.controllers;
      await dataLingkunganController.findAll(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/lingkunganWithTotalKeluarga", authMiddleware, async (req, res) => {
    try {
      const { dataLingkunganController } = req.app.locals.controllers;
      await dataLingkunganController.findAllWithTotalKeluarga(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ========== ANGGOTA ROUTES ==============

  app.patch("/anggota/:idAnggota/update", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      await dataAnggotaController.update(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/anggota/:idAnggota/delete", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      await dataAnggotaController.deleteOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/anggota/add", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      await dataAnggotaController.add(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/anggota/getTotal", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      await dataAnggotaController.getTotal(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/anggota/delete", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      await dataAnggotaController.deleteBulk(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/anggota/:idAnggota", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      await dataAnggotaController.findOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/anggota", authMiddleware, async (req, res) => {
    try {
      const { dataAnggotaController } = req.app.locals.controllers;
      if (req.query.idKeluarga) {
        await dataAnggotaController.findAllWithIdKeluarga(req, res);
      } else {
        await dataAnggotaController.findAll(req, res);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ========== KELUARGA ROUTES ============

  app.get("/keluarga/getTotal", authMiddleware, async (req, res) => {
    try {
      const { dataKeluargaController } = req.app.locals.controllers;
      const { idWilayah, idLingkungan } = req.query;

      if (idWilayah || idLingkungan) {
        await dataKeluargaController.getTotalWithFilter(req, res);
      } else {
        await dataKeluargaController.getTotal(req, res);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/keluarga/add", authMiddleware, async (req, res) => {
    try {
      const { dataKeluargaController } = req.app.locals.controllers;
      await dataKeluargaController.add(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch(
    "/keluarga/:idKeluarga/update",
    authMiddleware,
    async (req, res) => {
      try {
        const { dataKeluargaController } = req.app.locals.controllers;
        await dataKeluargaController.update(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.patch(
    "/keluarga/:idKeluarga/delete",
    authMiddleware,
    async (req, res) => {
      try {
        const { dataKeluargaController } = req.app.locals.controllers;
        await dataKeluargaController.deleteOne(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.get("/keluarga/:idKeluarga", authMiddleware, async (req, res) => {
    try {
      const { dataKeluargaController } = req.app.locals.controllers;
      await dataKeluargaController.findOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/keluarga", authMiddleware, async (req, res) => {
    try {
      const { dataKeluargaController } = req.app.locals.controllers;
      await dataKeluargaController.findAll(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ============ HISTORY ===========
  app.post(
    "/history/add",
    upload.single("FileBukti"),
    authMiddleware,
    async (req, res) => {
      try {
        const { transactionHistoryController } = req.app.locals.controllers;
        if (!req.body.History) {
          return res.status(400).json({ error: "History data is required" });
        }
        let parsedHistory;
        parsedHistory = JSON.parse(req.body.History);
        req.body.History = parsedHistory;
        await transactionHistoryController.addSantunan(req, res);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.post(
    "/history/addIuran",
    upload.single("FileBukti"),
    authMiddleware,
    async (req, res) => {
      try {
        const { transactionHistoryController } = req.app.locals.controllers;
        if (!req.body) {
          return res.status(400).json({ error: "History data is required" });
        }
        let parsedHistory;
        parsedHistory = JSON.parse(req.body.History);
        req.body.History = parsedHistory;
        await transactionHistoryController.addBatch(req, res);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.get("/history/getTotalIncome", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.getTotalIncome(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/history/getTotalOutcome", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.getTotalOutcome(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/history", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      const { idKeluarga } = req.query;
      if (idKeluarga) {
        await transactionHistoryController.findAllWithIdKeluarga(req, res);
      } else {
        await transactionHistoryController.findAll(req, res);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/historyByGroup", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.findByGroup(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/historyWithContext", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.findAllWithKeluargaContext(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/historyWithTimeFilter", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.findAllHistoryWithTimeFilter(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/historySetoran", authMiddleware, async (req, res) => {
    //TO DO WIP
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.findAllSetoran(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/history/:idTh/update", authMiddleware, async (req, res) => {
    //TO DO Belum ditest
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.update(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/history/:idTh/delete", authMiddleware, async (req, res) => {
    //TO DO Belum ditest
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.deleteOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/history/:idTh", authMiddleware, async (req, res) => {
    try {
      const { transactionHistoryController } = req.app.locals.controllers;
      await transactionHistoryController.findOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ========== STATIC FILE ==============
  // app.use("/uploads", express.static("uploads"));
  // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  logger.info("Routes setup completed");
};

module.exports = { setupRoutes };
