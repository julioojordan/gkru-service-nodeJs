const createHttpError = require("http-errors");

class DataLingkunganRepository {
  constructor() {}

  async findOneWithParam(idLingkungan, connection) {
    try {
      const sql = `SELECT l.id, l.kode_lingkungan, l.nama_lingkungan, w.id AS idWilayah, w.kode_wilayah, w.nama_wilayah FROM lingkungan l JOIN wilayah w ON l.id_wilayah = w.id WHERE l.id = ?`;

      const [rows] = await connection.execute(sql, [idLingkungan]);
      await connection.end();
      if (rows.length === 0) {
        throw createError(400, "Lingkungan not found");
      }
      return rows[0];
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to add data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async findOneById(id, connection) {
    // TODO ini digunakan untuk data keluarga kayanya langsung di eksekusi di repo keluarga saja nanti ini
    try {
      const sql = `
                SELECT l.id, l.kode_lingkungan, l.nama_lingkungan, 
                       w.id AS id_wilayah, w.kode_wilayah, w.nama_wilayah 
                FROM lingkungan l 
                JOIN wilayah w ON l.id_wilayah = w.id 
                WHERE l.id = ?`;

      const [rows] = await connection.execute(sql, [id]);
      if (rows.length === 0) {
        throw createHttpError(404, "Lingkungan not found");
      }
      return rows[0];
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }

  async findAll(connection) {
    try {
      const sql = `
                SELECT l.id, l.kode_lingkungan, l.nama_lingkungan, 
                       w.id AS id_wilayah, w.kode_wilayah, w.nama_wilayah 
                FROM lingkungan l 
                JOIN wilayah w ON l.id_wilayah = w.id 
                ORDER BY w.id ASC`;

      const [rows] = await connection.execute(sql);
      return rows;
    } catch (error) {
      throw createHttpError(500, `Internal Server Error: ${error.message}`, {
        expose: true,
      });
    }
  }

  async add(data, connection) {
    try {
      const sql = `INSERT INTO lingkungan (kode_lingkungan, nama_lingkungan, id_wilayah) VALUES (?, ?, ?)`;
      const [result] = await connection.execute(sql, [
        data.kodeLingkungan,
        data.namaLingkungan,
        data.wilayah,
      ]);
      return {
        id: result.insertId,
        kodeLingkungan: data.kodeLingkungan,
        namaLingkungan: data.namaLingkungan,
        wilayah: data.wilayah,
      };
    } catch (error) {
      throw createHttpError(500, `Failed to add data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async update(id, data, connection) {
    try {
      const updates = [];
      const params = [];

      if (data.kodeLingkungan) {
        updates.push("kode_lingkungan = ?");
        params.push(data.kodeLingkungan);
      }
      if (data.namaLingkungan) {
        updates.push("nama_lingkungan = ?");
        params.push(data.namaLingkungan);
      }
      if (data.wilayah) {
        updates.push("id_wilayah = ?");
        params.push(data.wilayah);
      }

      if (updates.length === 0) {
        throw createError(400, "No fields to update");
      }

      params.push(id);
      const sql = `UPDATE lingkungan SET ${updates.join(", ")} WHERE id = ?`;
      await connection.execute(sql, params);
      return { id, ...data };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to add data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async deleteOne(id, connection) {
    try {
      // Cek apakah masih ada keluarga yang terkait dengan wilayah ini
      const totalKeluargaSql = `SELECT COUNT(*) AS total FROM data_keluarga WHERE id_wilayah = ?`;
      const [keluargaRows] = await conn.execute(totalKeluargaSql, [idWilayah]);

      if (keluargaRows[0].total !== 0) {
        throw createHttpError(
          400,
          "Gagal menghapus wilayah karena masih digunakan oleh beberapa keluarga."
        );
      }
      const sql = `DELETE FROM lingkungan WHERE id = ?`;
      await connection.execute(sql, [id]);
      if (result.affectedRows === 0) {
        throw createHttpError(
          404,
          "Gagal menghapus wilayah atau wilayah tidak ditemukan."
        );
      }
      return { id };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to add data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async findAllWithTotalKeluarga(connection) {
    try {
      const sql = `SELECT 
                l.id, 
                l.kode_lingkungan, 
                l.nama_lingkungan, 
                w.id AS idWilayah, 
                w.kode_wilayah, 
                w.nama_wilayah, 
                COUNT(k.nomor) AS total_keluarga 
            FROM lingkungan l 
            JOIN wilayah w ON l.id_wilayah = w.id 
            LEFT JOIN data_keluarga k ON l.id = k.id_lingkungan
            GROUP BY l.id, l.nama_lingkungan, l.kode_lingkungan
            ORDER BY w.id ASC`;

      const [rows] = await connection.execute(sql);
      await connection.end();
      return rows;
    } catch (error) {
      throw createHttpError(500, `Failed to add data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async findOneByIdSeparateTx(id, connection) {
    // TODO ini digunakan untuk data keluarga kayanya langsung di eksekusi di repo keluarga saja nanti ini
    try {
      const sql = `SELECT l.id, l.kode_lingkungan, l.nama_lingkungan, w.id AS idWilayah, w.kode_wilayah, w.nama_wilayah FROM lingkungan l JOIN wilayah w ON l.id_wilayah = w.id WHERE l.id = ?`;

      const [rows] = await connection.execute(sql, [id]);
      await connection.end();
      if (rows.length === 0) {
        throw createError(400, "Lingkungan not found");
      }
      return rows[0];
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to add data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async getTotalLingkungan(connection) {
    try {
      const sql = `SELECT COUNT(*) AS total FROM lingkungan`;
      const [rows] = await connection.execute(sql);
      return rows[0];
    } catch (error) {
      throw createHttpError(500, `Failed to get total data: ${error.message}`, {
        expose: true,
      });
    }
  }
}

module.exports = DataLingkunganRepository;
