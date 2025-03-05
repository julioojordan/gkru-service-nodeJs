const createHttpError = require("http-errors");

class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findOne(req, connection) {
    const { username, password } = req.body;
    try {
      const sql =
        "SELECT id, username, ketua_lingkungan, ketua_wilayah FROM users WHERE username = ? AND password = ?";
      const [rows] = await connection.execute(sql, [username, password]);

      if (rows.length === 0) {
        throw createHttpError(404, "User tidak ditemukan");
      }

      return rows[0];
    } catch (error) {
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }

  async findAll(connection) {
    try {
      const sql =
        "SELECT id, username, ketua_lingkungan, ketua_wilayah FROM users";
      const [rows] = await connection.execute(sql);

      if (rows.length === 0) {
        throw createHttpError(404, "Tidak ada data user ditemukan");
      }

      return rows;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }

  async update(req, connection) {
    try {
      const { username, password, ketuaLingkungan, ketuaWilayah, updatedBy } =
        req.body;
      const idUser = req.params.idUser;
      let sql = "UPDATE users SET";
      const params = [];
      const setClauses = [];

      if (username) {
        setClauses.push("username = ?");
        params.push(username);
      }
      if (password) {
        setClauses.push("password = ?");
        params.push(password);
      }
      setClauses.push("ketua_lingkungan = ?");
      params.push(ketuaLingkungan);
      setClauses.push("ketua_wilayah = ?");
      params.push(ketuaWilayah);
      setClauses.push("updated_by = ?");
      params.push(updatedBy);
      setClauses.push("updated_date = ?");
      params.push(new Date());

      if (setClauses.length === 0) {
        throw createHttpError(400, "No fields to update");
      }

      sql += " " + setClauses.join(", ") + " WHERE id = ?";
      params.push(idUser);

      const [result] = await connection.execute(sql, params);

      if (result.affectedRows === 0) {
        throw createHttpError(
          404,
          "Gagal update data user atau user tidak ditemukan"
        );
      }

      return {
        id: idUser,
        ...req.body,
      };
    } catch (error) {
      // Jika error sudah merupakan instance dari createHttpError, langsung lempar ulang
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }

      // Jika bukan, bungkus dalam error 500
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }

  async add(userData, connection) {
    try {
      const sql =
        "INSERT INTO users(username, password, ketua_lingkungan, ketua_wilayah, created_date, updated_date, created_by, updated_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
      const params = [
        userData.username,
        userData.password,
        userData.ketuaLingkungan,
        userData.ketuaWilayah,
        new Date(),
        new Date(),
        userData.createdBy,
        userData.updatedBy,
      ];
      const [result] = await connection.execute(sql, params);

      if (result.affectedRows === 0) {
        throw createHttpError(500, "Gagal menambahkan user", { expose: true });
      }

      return { id: result.insertId };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }

  async deleteOne(idUser, connection) {
    try {
      const sql = "DELETE FROM users WHERE id = ?";
      const [result] = await connection.execute(sql, [idUser]);

      if (result.affectedRows === 0) {
        throw createHttpError(
          404,
          "Gagal menghapus user atau user tidak ditemukan"
        );
      }

      return { id: idUser };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }
}

module.exports = UserRepository;
