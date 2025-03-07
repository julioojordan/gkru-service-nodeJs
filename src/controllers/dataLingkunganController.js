const handleError = require("../helpers/handleErrorHelper");

class DataLingkunganController {
    constructor(dataLingkunganService) {
      this.dataLingkunganService = dataLingkunganService;
    }
  
    async findOneWithParam(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataLingkungan = await this.dataLingkunganService.findOneWithParam(req.params.idLingkungan);
        logger.info("Fetching data lingkungan sukses", { params: req.params });
        res.json({ code: 200, status: "Ok", data: dataLingkungan });
      } catch (err) {
        logger.error("Error fetching data lingkungan", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async findAll(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataLingkungan = await this.dataLingkunganService.findAll();
        logger.info("Fetching all data lingkungan sukses");
        res.json({ code: 200, status: "Ok", data: dataLingkungan });
      } catch (err) {
        logger.error("Error fetching all data lingkungan", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async findAllWithTotalKeluarga(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataLingkungan = await this.dataLingkunganService.findAllWithTotalKeluarga();
        logger.info("Fetching data lingkungan with total keluarga sukses");
        res.json({ code: 200, status: "Ok", data: dataLingkungan });
      } catch (err) {
        logger.error("Error fetching data lingkungan with total keluarga", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async add(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataLingkungan = await this.dataLingkunganService.add(req.body);
        logger.info("Adding data lingkungan sukses", { data: req.body });
        res.json({ code: 200, status: "Ok", data: dataLingkungan });
      } catch (err) {
        logger.error("Error adding data lingkungan", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async update(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataLingkungan = await this.dataLingkunganService.update(req.params.idLingkungan, req.body);
        logger.info("Updating data lingkungan sukses", { id: req.params.idLingkungan });
        res.json({ code: 200, status: "Ok", data: dataLingkungan });
      } catch (err) {
        logger.error("Error updating data lingkungan", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async deleteOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const dataLingkungan = await this.dataLingkunganService.deleteOne(req.params.idLingkungan);
        logger.info("Deleting data lingkungan sukses", { id: req.params.idLingkungan });
        res.json({ code: 200, status: "Ok", message: "Data lingkungan berhasil dihapus", data: dataLingkungan});
      } catch (err) {
        logger.error("Error deleting data lingkungan", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  
    async getTotalLingkungan(req, res) {
      const logger = req.app.locals.logger;
      try {
        const total = await this.dataLingkunganService.getTotalLingkungan();
        logger.info("Fetching total lingkungan sukses");
        res.json({ code: 200, status: "Ok", data: total });
      } catch (err) {
        logger.error("Error fetching total lingkungan", { error: err.message });
        return handleError(res, logger, err);
      }
    }
  }
  
  module.exports = DataLingkunganController;
  