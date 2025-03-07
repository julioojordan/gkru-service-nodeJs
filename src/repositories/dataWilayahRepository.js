const createHttpError = require("http-errors");

class DataWilayahRepository {
  constructor() {
  }

  async findOne(idWilayah, conn) {
    try {
      const sqlScript = "SELECT id as Id, kode_wilayah as KodeWilayah, nama_wilayah as NamaWilayah FROM wilayah WHERE id = ?";
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
      const sqlScript = "SELECT id as Id, kode_wilayah as KodeWilayah, nama_wilayah as NamaWilayah FROM wilayah ORDER BY id ASC";
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
        Id: result.insertId,
        KodeWilayah: request.kodeWilayah,
        NamaWilayah: request.namaWilayah,
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
      return {
        Id: idWilayah,
        KodeWilayah: request.kodeWilayah,
        NamaWilayah: request.namaWilayah,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async deleteOne(idWilayah, conn) { //TODO perlu di cek lagi ya
    try {
        // Cek apakah masih ada lingkungan yang menggunakan wilayah ini
        const totalLingkunganSql = `SELECT COUNT(*) AS total FROM lingkungan WHERE id_wilayah = ?`;
        const [lingkunganRows] = await conn.execute(totalLingkunganSql, [idWilayah]);

        if (lingkunganRows[0].total !== 0) {
            throw createHttpError(400, "Gagal menghapus wilayah karena masih digunakan oleh beberapa lingkungan.");
        }

        // Cek apakah masih ada keluarga yang terkait dengan wilayah ini
        const totalKeluargaSql = `SELECT COUNT(*) AS total FROM data_keluarga WHERE id_wilayah = ?`;
        const [keluargaRows] = await conn.execute(totalKeluargaSql, [idWilayah]);

        if (keluargaRows[0].total !== 0) {
            throw createHttpError(400, "Gagal menghapus wilayah karena masih digunakan oleh beberapa keluarga.");
        }

        // Jika tidak ada lingkungan dan keluarga yang terkait, lanjutkan penghapusan
        const deleteSql = "DELETE FROM wilayah WHERE id = ?";
        const [result] = await conn.execute(deleteSql, [idWilayah]);

        if (result.affectedRows === 0) {
            throw createHttpError(404, "Gagal menghapus wilayah atau wilayah tidak ditemukan.");
        }

        return { Id: idWilayah };
    } catch (error) {
        if (error instanceof createHttpError.HttpError) {
            throw error;
        }
        throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
}

  async getTotalWilayah(conn) {
    try {
      const sqlScript = "SELECT COUNT(*) AS Total FROM wilayah";
      const [rows] = await conn.execute(sqlScript);

      if (rows.length === 0 || rows[0].Total === undefined) {
        throw createHttpError(500, "Failed to retrieve total wilayah");
      }

      return { Total: rows[0].Total };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = DataWilayahRepository;
