const handleError = require("../helpers/handleErrorHelper");

class TransactionHistoryController {
  constructor(transactionHistoryService) {
    this.transactionHistoryService = transactionHistoryService;
  }

  async add(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.add(
        req.body
      );
      logger.info("Adding transaction History sukses", { data: req.body });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error adding transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async addBatch(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.addBatch(
        req.body
      );
      logger.info("Adding transaction History sukses", { data: req.body });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error adding transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async getTotalIncome(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.getTotalIncome(
        req.query
      );
      logger.info("Fetching total income sukses", { params: req.query });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching total income", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async getTotalOutcome(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.getTotalOutcome(
        req.query
      );
      logger.info("Fetching total outcome sukses", { params: req.query });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching total outcome", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findAll(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory =
        await this.transactionHistoryService.findAll();
      logger.info("Fetching all transaction History sukses");
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching all transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }
  

  async findByGroup(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.findByGroup(
        req.query.idGroup
      );
      logger.info("Fetching transaction History by Group sukses", { params: req.query.idGroup });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching transaction History by Group", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findAllWithKeluargaContext(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory =
        await this.transactionHistoryService.findAllWithKeluargaContext(req.query.tahun);
      logger.info("Fetching all transaction History With Keluarga Context sukses");
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching all transaction With Keluarga Context History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findAllHistoryWithTimeFilter(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory =
        await this.transactionHistoryService.findAllHistoryWithTimeFilter(req.query);
      logger.info("Fetching all transaction History With Time Filter sukses");
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching all transaction History With Time Filter", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findAllSetoran(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory =
        await this.transactionHistoryService.findAllSetoran(req.query);
      logger.info("Fetching all transaction History sukses");
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching all transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findOne(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.findOne(
        req.params.idTh
      );
      logger.info("Fetching transaction History sukses", { params: req.params });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findAllWithIdKeluarga(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory =
        await this.transactionHistoryService.findAllWithIdKeluarga(req.query);
      logger.info("Fetching all transaction History sukses");
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error fetching all transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async update(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.update(
        req.params.idTh,
        req.body
      );
      logger.info("Updating transaction History sukses", { id: req.params.idTh });
      res.json({ code: 200, status: "Ok", data: transactionHistory });
    } catch (err) {
      logger.error("Error updating transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async deleteOne(req, res) {
    const logger = req.app.locals.logger;
    try {
      const transactionHistory = await this.transactionHistoryService.deleteOne(
        req.params.idTh
      );
      logger.info("Deleting transaction History sukses", { id: req.params.idTh });
      res.json({
        code: 200,
        status: "Ok",
        message: "transaction History berhasil dihapus",
        data: transactionHistory,
      });
    } catch (err) {
      logger.error("Error deleting transaction History", { error: err.message });
      return handleError(res, logger, err);
    }
  }
}

module.exports = TransactionHistoryController;
