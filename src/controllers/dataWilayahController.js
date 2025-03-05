const handleError = require("../helpers/handleErrorHelper");

class DataWilayahController {
  constructor(dataWilayahService) {
    this.dataWilayahService = dataWilayahService;
  }

  async findOne(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataWilayah = await this.dataWilayahService.findOne(req);
      logger.info("Fetching wilayah sukses", { id: req.params.idWilayah });
      res.json({ code: 200, status: "Ok", data: dataWilayah });
    } catch (err) {
      logger.error("Error fetching wilayah", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async findAll(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataWilayah = await this.dataWilayahService.findAll();
      logger.info("Fetching semua wilayah sukses");
      res.json({ code: 200, status: "Ok", data: dataWilayah });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }

  async add(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataWilayah = await this.dataWilayahService.add(req);
      logger.info("Wilayah berhasil ditambahkan", { data: dataWilayah });
      res.json({ code: 200, status: "Ok", data: dataWilayah });
    } catch (err) {
      logger.error("Error menambahkan wilayah", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async update(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataWilayah = await this.dataWilayahService.update(req);
      logger.info("Wilayah berhasil diupdate", { id: req.params.idWilayah });
      res.json({ code: 200, status: "Ok", data: dataWilayah });
    } catch (err) {
      logger.error("Error mengupdate wilayah", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async deleteOne(req, res) {
    const logger = req.app.locals.logger;
    try {
      const dataWilayah = await this.dataWilayahService.deleteOne(req);
      logger.info("Wilayah berhasil dihapus", { id: req.params.idWilayah });
      res.json({ code: 200, status: "Ok", data: dataWilayah });
    } catch (err) {
      logger.error("Error menghapus wilayah", { error: err.message });
      return handleError(res, logger, err);
    }
  }

  async getTotalWilayah(req, res) {
    const logger = req.app.locals.logger;
    try {
      const totalWilayah = await this.dataWilayahService.getTotalWilayah(req);
      logger.info("Total wilayah berhasil dihitung");
      res.json({ code: 200, status: "Ok", data: totalWilayah });
    } catch (err) {
      logger.error("Error menghitung total wilayah", { error: err.message });
      return handleError(res, logger, err);
    }
  }
}

module.exports = DataWilayahController;
