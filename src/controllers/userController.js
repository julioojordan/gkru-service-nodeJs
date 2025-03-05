const handleError = require("../helpers/handleErrorHelper")

class UserController {
    constructor(userService) {
      this.userService = userService;
  
      // Bind methods to ensure `this` context remains correct
      this.findOne = this.findOne.bind(this);
      this.findAll = this.findAll.bind(this);
      this.update = this.update.bind(this);
      this.add = this.add.bind(this);
      this.deleteOne = this.deleteOne.bind(this);
    }
  
    async findOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const user = await this.userService.findOne(req);
        logger.info({ type: "response", code: 200, status: "OK", message: "User Ditemukan" }, "Success");
        return res.json({ code: 200, status: "OK", data: user });
      } catch (err) {
        return handleError(res, logger, err);
      }
    }
  
    async findAll(req, res) {
      const logger = req.app.locals.logger;
      try {
        const users = await this.userService.findAll(req);
        logger.info({ type: "response", code: 200, status: "OK", data: users, message: "User Ditemukan" }, "Success");
        return res.json({ code: 200, status: "OK", data: users });
      } catch (err) {
        return handleError(res, logger, err);
      }
    }
  
    async update(req, res) {
      const logger = req.app.locals.logger;
      try {
        const updatedUser = await this.userService.update(req);
        logger.info({ type: "response", code: 200, status: "OK", data: updatedUser, message: "User Berhasil diupdate" }, "Success");
        return res.json({ code: 200, status: "OK", data: updatedUser });
      } catch (err) {
        return handleError(res, logger, err);
      }
    }
  
    async add(req, res) {
      const logger = req.app.locals.logger;
      try {
        const newUser = await this.userService.add(req);
        logger.info({ type: "response", code: 200, status: "OK", data: newUser, message: "User Berhasil ditambahkan" }, "Success");
        return res.json({ code: 200, status: "OK", data: newUser });
      } catch (err) {
        return handleError(res, logger, err);
      }
    }
  
    async deleteOne(req, res) {
      const logger = req.app.locals.logger;
      try {
        const deletedUser = await this.userService.deleteOne(req);
        logger.info({ type: "response", code: 200, status: "OK", data: deletedUser, message: "User Berhasil dihapus" }, "Success");
        return res.json({ code: 200, status: "OK", data: deletedUser });
      } catch (err) {
        return handleError(res, logger, err);
      }
    }
  }
  
  module.exports = UserController;
  