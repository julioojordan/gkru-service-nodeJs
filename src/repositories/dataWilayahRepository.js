const createHttpError = require("http-errors");

class DataWilayahRepository {
  constructor() {
  }

  async findOne(idWilayah, conn) {
    try {
      const sqlScript = "SELECT id, kode_wilayah, nama_wilayah FROM wilayah WHERE id = ?";
      const [rows] = await conn.execute(sqlScript, [idWilayah]);

      if (rows.length === 0) {
        throw createHttpError(404, "Wilayah tidak Ditemukan");
      }

      return rows[0];
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async findAll(conn) {
    try {
      const sqlScript = "SELECT id, kode_wilayah, nama_wilayah FROM wilayah ORDER BY id ASC";
      const [rows] = await conn.execute(sqlScript);

    //   if (rows.length === 0) {
    //     throw createHttpError(404, "No wilayah found");
    //   }

      return rows;
    } catch (error) {
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async add(request, conn) {
    try {
      const sqlScript = "INSERT INTO wilayah(kode_wilayah, nama_wilayah) VALUES(?, ?)";
      const [result] = await conn.execute(sqlScript, [
        request.kodeWilayah,
        request.namaWilayah,
      ]);

      if (!result.insertId) {
        throw createHttpError(500, "gagal memasukan data wilayah");
      }

      return {
        id: result.insertId,
        kodeWilayah: request.kodeWilayah,
        namaWilayah: request.namaWilayah,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async update(idWilayah, request, conn) {
    try {
      let sqlScript = "UPDATE wilayah SET ";
      let setClauses = [];
      let params = [];

      if (request.kodeWilayah) {
        setClauses.push("kode_wilayah = ?");
        params.push(request.kodeWilayah);
      }
      if (request.namaWilayah) {
        setClauses.push("nama_wilayah = ?");
        params.push(request.namaWilayah);
      }

      if (setClauses.length === 0) {
        throw createHttpError(400, "No fields to update");
      }

      sqlScript += setClauses.join(", ") + " WHERE id = ?";
      params.push(idWilayah);
      const [result] = await conn.execute(sqlScript, params);

      if (result.affectedRows === 0) {
        throw createHttpError(404, "Failed to update wilayah or no changes made");
      }

      return { id: idWilayah, ...request };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async deleteOne(idWilayah, conn) { // TODO perlu cek apakah ada lingkungan yang di wilayah ini atau tidak
    try {
      const sqlScript = "DELETE FROM wilayah WHERE id = ?";
      const [result] = await conn.execute(sqlScript, [idWilayah]);

      if (result.affectedRows === 0) {
        throw createHttpError(404, "Failed to delete wilayah or wilayah not found");
      }

      return { id: idWilayah };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async getTotalWilayah(conn) {
    try {
      const sqlScript = "SELECT COUNT(*) AS total FROM wilayah";
      const [rows] = await conn.execute(sqlScript);

      if (rows.length === 0 || rows[0].total === undefined) {
        throw createHttpError(500, "Failed to retrieve total wilayah");
      }

      return { total: rows[0].total };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = DataWilayahRepository;
