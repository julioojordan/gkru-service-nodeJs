const createHttpError = require("http-errors");

class DataLingkunganRepository {
  constructor() {}

  async findOneWithParam(idLingkungan, connection) {
    try {
      const sql = `SELECT l.id, l.kode_lingkungan, l.nama_lingkungan, w.id AS id_wilayah, w.kode_wilayah, w.nama_wilayah FROM lingkungan l JOIN wilayah w ON l.id_wilayah = w.id WHERE l.id = ?`;

      const [rows] = await connection.execute(sql, [idLingkungan]);
      if (rows.length === 0) {
        throw createHttpError(400, "Lingkungan not found");
      }
      return {
        Id: rows[0].id,
        KodeLingkungan: rows[0].kode_lingkungan,
        NamaLingkungan: rows[0].nama_lingkungan,
        Wilayah: {
          Id: rows[0].id_wilayah,
          KodeWilayah: rows[0].kode_wilayah,
          NamaWilayah: rows[0].nama_wilayah,
        },
      };
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
      return rows.map((row) => ({
        Id: row.id,
        KodeLingkungan: row.kode_lingkungan,
        NamaLingkungan: row.nama_lingkungan,
        Wilayah: {
          Id: row.id_wilayah,
          KodeWilayah: row.kode_wilayah,
          NamaWilayah: row.nama_wilayah,
        },
      }));
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
        Id: result.insertId,
        KodeLingkungan: data.kodeLingkungan,
        NamaLingkungan: data.namaLingkungan,
        Wilayah: data.wilayah,
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
        throw createHttpError(400, "No fields to update");
      }

      params.push(id);
      const sql = `UPDATE lingkungan SET ${updates.join(", ")} WHERE id = ?`;
      await connection.execute(sql, params);
      
      return {
        Id: id,
        KodeLingkungan: data.kodeLingkungan,
        NamaLingkungan: data.namaLingkungan,
        Wilayah: data.wilayah,
      };
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
      // Cek apakah masih ada keluarga yang terkait dengan lingkungan ini
      const totalKeluargaSql = `SELECT COUNT(*) AS total FROM data_keluarga WHERE id_lingkungan = ?`;
      const [keluargaRows] = await connection.execute(totalKeluargaSql, [id]);

      if (keluargaRows[0].total !== 0) {
        throw createHttpError(
          400,
          "Gagal menghapus lingkungan karena masih digunakan oleh beberapa keluarga."
        );
      }
      const sql = `DELETE FROM lingkungan WHERE id = ?`;
      const [result] = await connection.execute(sql, [id]);
      if (result.affectedRows === 0) {
        throw createHttpError(
          404,
          "Gagal menghapus lingkungan atau lingkungan tidak ditemukan."
        );
      }
      return { Id: id };
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
                w.id AS id_wilayah, 
                w.kode_wilayah, 
                w.nama_wilayah, 
                COUNT(k.nomor) AS total_keluarga 
            FROM lingkungan l 
            JOIN wilayah w ON l.id_wilayah = w.id 
            LEFT JOIN data_keluarga k ON l.id = k.id_lingkungan
            GROUP BY l.id, l.nama_lingkungan, l.kode_lingkungan
            ORDER BY w.id ASC`;

      const [rows] = await connection.execute(sql);
      return rows.map((row) => ({
        Id: row.id,
        KodeLingkungan: row.kode_lingkungan,
        NamaLingkungan: row.nama_lingkungan,
        Wilayah: {
          Id: row.id_wilayah,
          KodeWilayah: row.kode_wilayah,
          NamaWilayah: row.nama_wilayah,
        },
        TotalKeluarga: row.total_keluarga
      }));
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
      if (rows.length === 0) {
        throw createHttpError(400, "Lingkungan not found");
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
      const sql = `SELECT COUNT(*) AS Total FROM lingkungan`;
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
