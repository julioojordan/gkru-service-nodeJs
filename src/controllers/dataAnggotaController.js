const handleError = require("../helpers/handleErrorHelper");

class DataAnggotaController {
    constructor(dataAnggotaService) {
      this.dataAnggotaService = dataAnggotaService;
    }
  
    async findOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataAnggota = await this.dataAnggotaService.findOne(req.params.idAnggota);
        logger.info("Fetching data Anggota sukses", { params: req.params });
        res.json({ code: 200, status: "Ok", data: dataAnggota });
      } catch (err) {
        logger.error("Error fetching data Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async findAllWithIdKeluarga(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataAnggota = await this.dataAnggotaService.findAllWithIdKeluarga(req.query);
        logger.info("Fetching all data Anggota sukses");
        res.json({ code: 200, status: "Ok", data: dataAnggota });
      } catch (err) {
        logger.error("Error fetching all data Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }

    async findAll(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataAnggota = await this.dataAnggotaService.findAll(req.query);
        logger.info("Fetching all data Anggota sukses");
        res.json({ code: 200, status: "Ok", data: dataAnggota });
      } catch (err) {
        logger.error("Error fetching all data Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async add(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataAnggota = await this.dataAnggotaService.add(req.body);
        logger.info("Adding data Anggota sukses", { data: req.body });
        res.json({ code: 200, status: "Ok", data: dataAnggota });
      } catch (err) {
        logger.error("Error adding data Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async update(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataAnggota = await this.dataAnggotaService.update(req.params.idAnggota, req.body);
        logger.info("Updating data Anggota sukses", { id: req.params.idAnggota });
        res.json({ code: 200, status: "Ok", data: dataAnggota });
      } catch (err) {
        logger.error("Error updating data Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async deleteOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataAnggota = await this.dataAnggotaService.deleteOne(req.params.idAnggota);
        logger.info("Deleting data Anggota sukses", { id: req.params.idAnggota });
        res.json({ code: 200, status: "Ok", message: "Data Anggota berhasil dihapus", data: dataAnggota});
      } catch (err) {
        logger.error("Error deleting data Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async getTotal(req, res) {
      const logger = req.app.locals.logger;
      try {
        const total = await this.dataAnggotaService.getTotal();
        logger.info("Fetching total Anggota sukses");
        res.json({ code: 200, status: "Ok", data: total });
      } catch (err) {
        logger.error("Error fetching total Anggota", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  }
  
  module.exports = DataAnggotaController;
  