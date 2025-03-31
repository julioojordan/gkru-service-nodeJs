const handleError = require("../helpers/handleErrorHelper");

class DataKeluargaController {
    constructor(dataKeluargaService) {
      this.dataKeluargaService = dataKeluargaService;
    }
  
    async findOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataKeluarga = await this.dataKeluargaService.findOne(req.params.idKeluarga);
        logger.info("Fetching data Keluarga sukses", { params: req.params });
        res.json({ code: 200, status: "Ok", data: dataKeluarga });
      } catch (err) {
        logger.error("Error fetching data Keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async findAll(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataKeluarga = await this.dataKeluargaService.findAll(req.query);
        logger.info("Fetching all data Keluarga sukses");
        res.json({ code: 200, status: "Ok", data: dataKeluarga });
      } catch (err) {
        logger.error("Error fetching all data Keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async add(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataKeluarga = await this.dataKeluargaService.add(req.body);
        logger.info("Adding data Keluarga sukses", { data: req.body });
        res.json({ code: 200, status: "Ok", data: dataKeluarga });
      } catch (err) {
        logger.error("Error adding data Keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async update(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataKeluarga = await this.dataKeluargaService.update(req.params.idKeluarga, req.body);
        logger.info("Updating data Keluarga sukses", { id: req.params.idKeluarga });
        res.json({ code: 200, status: "Ok", data: dataKeluarga });
      } catch (err) {
        logger.error("Error updating data Keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async deleteOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataKeluarga = await this.dataKeluargaService.deleteOne(req.params.idKeluarga);
        logger.info("Deleting data Keluarga sukses", { id: req.params.idKeluarga });
        res.json({ code: 200, status: "Ok", message: "Data Keluarga berhasil dihapus", data: dataKeluarga});
      } catch (err) {
        logger.error("Error deleting data Keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async getTotal(req, res) {
      const logger = req.app.locals.logger;
      try {
        const total = await this.dataKeluargaService.getTotal();
        logger.info("Fetching total Keluarga sukses");
        res.json({ code: 200, status: "Ok", data: total });
      } catch (err) {
        logger.error("Error fetching total Keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }

    async getTotalWithFilter(req, res) {
        const logger = req.app.locals.logger;
        try {
          const total = await this.dataKeluargaService.getTotalWithFilter(req.query);
          logger.info("Fetching total Keluarga sukses");
          res.json({ code: 200, status: "Ok", data: total });
        } catch (err) {
          logger.error("Error fetching total Keluarga", { error: err.message });
          return handleError(res, logger, err);
        }
      }
  }
  
  module.exports = DataKeluargaController;
  