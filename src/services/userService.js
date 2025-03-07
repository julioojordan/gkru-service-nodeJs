const authentication = require("../authentication/authentication")

class UserService {
    constructor(userRepository, db) {
      this.userRepository = userRepository;
      this.db = db;
  
      // Bind methods to maintain `this` context
      this.findOne = this.findOne.bind(this);
      this.findAll = this.findAll.bind(this);
      this.update = this.update.bind(this);
      this.add = this.add.bind(this);
      this.deleteOne = this.deleteOne.bind(this);
    }
  
    async findOne(req) {
      const logger = req.app.locals.logger;
      const connection = await this.db.getConnection();
      try {
        await connection.beginTransaction();
        const user = await this.userRepository.findOne(req, connection);
        
        if (!user) {
          throw new Error("User not found");
        }
  
        const authToken = await authentication.createToken(user.username, req);
        await connection.commit();
        return {
            auth: authToken,
            id: user.Id,
            username: user.Username,
            ketuaLingkungan: user.KetuaLingkungan,
            ketuaWilayah: user.KetuaWilayah,
        }
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
  
    async findAll(req) {
      const logger = req.app.locals.logger;
      const connection = await this.db.getConnection();
      try {
        await connection.beginTransaction();
        const users = await this.userRepository.findAll(connection);
        await connection.commit();
        return users;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
  
    async update(req) {
      const logger = req.app.locals.logger;
      const connection = await this.db.getConnection();
      try {
        await connection.beginTransaction();
        const updatedUser = await this.userRepository.update(req, connection);
        await connection.commit();
        return updatedUser;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
  
    async add(req) {
      const logger = req.app.locals.logger;
      const connection = await this.db.getConnection();
      try {
        await connection.beginTransaction();
        const newUser = await this.userRepository.add(req.body, connection);
        await connection.commit();
        return newUser;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
  
    async deleteOne(req) {
      const logger = req.app.locals.logger;
      const connection = await this.db.getConnection();
      try {
        await connection.beginTransaction();
        const deletedUser = await this.userRepository.deleteOne(req.params.idUser, connection);
        await connection.commit();
        return deletedUser;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
  }
  
  module.exports = UserService;
  