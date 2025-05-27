const {
  addLingkunganOrWilayahQueryHelper,
  convertToInterfaceArray,
} = require("../helpers/addLingkunganOrWilayahQueryHelper");
const {
    mapToThFinal,
    mapToThFinal2,
  } = require("../helpers/thMapper");
const createHttpError = require("http-errors");
const saveFile = require("../helpers/saveFileHelper");

class TransactionHistoryRepository {
  constructor() {}

  async getTotalIncome(req, connection) {
    try {
      let sql = `
            SELECT SUM(a.nominal) AS total
            FROM riwayat_transaksi a
            JOIN data_keluarga b ON a.id_keluarga = b.id
            WHERE keterangan = 'IN'
          `;

      // Menambahkan filter wilayah atau lingkungan jika ada
      const { query, params } = addLingkunganOrWilayahQueryHelper(
        sql,
        req.id_wilayah,
        req.id_lingkungan
      );

      const [rows] = await connection.execute(query, params);

      if (rows.length === 0 || rows[0].total === null) {
        // throw createHttpError(500, "Data Tidak Ditemukan");
        return { Nominal: 0 };
      }

      return { Nominal: rows[0].total };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async getTotalOutcome(query, connection) {
    try {
      const { id_wilayah, id_lingkungan } = query;

      let sql = `
        SELECT SUM(a.nominal) AS nominal
        FROM riwayat_transaksi a
        JOIN data_keluarga b ON a.id_keluarga = b.id
        WHERE keterangan = 'OUT'
      `;

      // Tambahkan filter wilayah atau lingkungan jika ada
      const params = [];
      if (id_wilayah) {
        sql += " AND b.id_wilayah = ?";
        params.push(id_wilayah);
      }
      if (id_lingkungan) {
        sql += " AND b.id_lingkungan = ?";
        params.push(id_lingkungan);
      }

      const [rows] = await connection.execute(sql, params);

      if (rows.length === 0) {
        // throw createHttpError(500, "Data Tidak Ditemukan");
        return { Nominal: 0 };
      }

      // Jika hasil query NULL, set ke 0
      const nominal = rows[0].nominal || 0;

      return { Nominal: nominal };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async findOne(idTh, connection) {
    try {
      if (isNaN(idTh)) {
        throw createHttpError(400, "Invalid id TH, it must be an integer");
      }

      const sql = `
        SELECT 
          a.id, 
          a.nominal, 
          a.id_keluarga, 
          a.keterangan, 
          a.created_by, 
          c.id_wilayah, 
          c.id_lingkungan, 
          a.updated_by, 
          a.sub_keterangan, 
          a.created_date, 
          a.updated_date, 
          a.bulan,
          a.tahun,
          a.group_id,
          b.username, 
          d.kode_lingkungan, 
          d.nama_lingkungan, 
          e.kode_wilayah, 
          e.nama_wilayah,
          f.file
        FROM 
          riwayat_transaksi a
        JOIN 
          users b ON a.created_by = b.id
        JOIN
          data_keluarga c ON a.id_keluarga = c.id
        JOIN 
          lingkungan d ON c.id_lingkungan = d.id
        JOIN 
          wilayah e ON c.id_wilayah = e.id
        LEFT JOIN 
          grouped_transaksi f ON a.group_id = f.id
        WHERE 
          a.id = ?`;

      const [rows] = await connection.execute(sql, [idTh]);

      if (rows.length === 0) {
        throw createHttpError(500, "Data Tidak Ditemukan");
      }

      // Mapping hasil query ke format final
      return mapToThFinal(rows[0]);
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async findByGroup(idGroup, connection) {
    try {
      if (!idGroup) {
        throw createHttpError(400, "Parameter idGroup harus disertakan");
      }

      const sql = `
        SELECT 
          a.id, a.nominal, a.id_keluarga, a.keterangan, a.created_by, 
          c.id_wilayah, c.id_lingkungan, a.updated_by, a.sub_keterangan, 
          a.created_date, a.updated_date, a.bulan, a.tahun,
          b.username, 
          d.kode_lingkungan, d.nama_lingkungan, 
          e.kode_wilayah, e.nama_wilayah, f.file, a.group_id
        FROM riwayat_transaksi a
        LEFT JOIN users b ON a.created_by = b.id
        LEFT JOIN data_keluarga c ON a.id_keluarga = c.id
        LEFT JOIN lingkungan d ON c.id_lingkungan = d.id
        LEFT JOIN wilayah e ON c.id_wilayah = e.id
        JOIN grouped_transaksi f ON a.group_id = f.id
        WHERE a.group_id = ?
        ORDER BY a.created_date ASC`;

      const [rows] = await connection.execute(sql, [idGroup]);

      if (rows.length === 0) {
        throw createHttpError(500, "Data Tidak Ditemukan");
      }

      // Mapping hasil query ke format final
      return rows.map(mapToThFinal);
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async findAll(connection) {
    try {
      const sql = `
        SELECT 
          a.id, a.nominal, a.id_keluarga, a.keterangan, a.created_by, 
          c.id_wilayah, c.id_lingkungan, a.updated_by, a.sub_keterangan, 
          a.created_date, a.updated_date, a.bulan, a.tahun,
          b.username, 
          d.kode_lingkungan, d.nama_lingkungan, 
          e.kode_wilayah, e.nama_wilayah
        FROM riwayat_transaksi a
        LEFT JOIN users b ON a.created_by = b.id
        LEFT JOIN data_keluarga c ON a.id_keluarga = c.id
        LEFT JOIN lingkungan d ON c.id_lingkungan = d.id
        LEFT JOIN wilayah e ON c.id_wilayah = e.id
        ORDER BY a.created_date ASC`;

      const [rows] = await connection.execute(sql);
      console.log({rows});

      if (rows.length === 0) {
        // throw createHttpError(404, "Data Tidak Ditemukan");
        return null
      }

      let results = [];
      rows.forEach(row => {
        results.push(mapToThFinal(row));
      });
      return results;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async findAllWithKeluargaContext(tahun, connection) {
    let year = 0;
    try {
      const sql = `
        SELECT 
          a.id, 
          a.nominal, 
          a.id_keluarga, 
          a.keterangan, 
          a.created_by, 
          c.id_wilayah, 
          c.id_lingkungan, 
          a.updated_by, 
          a.sub_keterangan, 
          a.created_date, 
          a.updated_date, 
          a.bulan, 
          a.tahun,
          b.username, 
          d.kode_lingkungan, 
          d.nama_lingkungan, 
          e.kode_wilayah, 
          e.nama_wilayah,
          f.nama_lengkap AS nama_kepala_keluarga
        FROM riwayat_transaksi a
        LEFT JOIN users b 
          ON a.created_by = b.id
        LEFT JOIN data_keluarga c 
          ON a.id_keluarga = c.id
        LEFT JOIN lingkungan d 
          ON c.id_lingkungan = d.id
        LEFT JOIN wilayah e 
          ON c.id_wilayah = e.id
        LEFT JOIN data_anggota f 
          ON c.id_kepala_keluarga = f.id
        WHERE YEAR(a.created_date) = ?
        ORDER BY a.created_date ASC;
      `;
      if (tahun){
        year = tahun
      }

      const [rows] = await connection.execute(sql, [year]);

      if (rows.length === 0) {
        // throw createHttpError(404, "Data Tidak Ditemukan");
        return null
      }

      // Mapping hasil query
      let results = [];
      rows.forEach(row => {
        results.push(mapToThFinal2(row));
      });

      return results;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  //TO DO WIP
  async findAllSetoran(connection, tahun, bulan) {
    try {
      const sql = `
        SELECT 
          a.id, 
          a.nominal, 
          a.id_keluarga, 
          a.keterangan, 
          a.created_by, 
          c.id_wilayah, 
          c.id_lingkungan, 
          a.updated_by, 
          a.sub_keterangan, 
          a.created_date, 
          a.updated_date, 
          a.bulan, 
          a.tahun,
          b.username, 
          d.kode_lingkungan, 
          d.nama_lingkungan, 
          e.kode_wilayah, 
          e.nama_wilayah,
          f.nama_lengkap AS nama_kepala_keluarga
        FROM riwayat_transaksi a
        LEFT JOIN users b 
          ON a.created_by = b.id
        LEFT JOIN data_keluarga c 
          ON a.id_keluarga = c.id
        LEFT JOIN lingkungan d 
          ON c.id_lingkungan = d.id
        LEFT JOIN wilayah e 
          ON c.id_wilayah = e.id
        LEFT JOIN data_anggota f 
          ON c.id_kepala_keluarga = f.id
        WHERE tahun = ? AND bulan = ?
        ORDER BY a.created_date ASC;
      `;

      const [rows] = await connection.execute(sql, [tahun, bulan]);

      if (rows.length === 0) {
        // throw createHttpError(404, "Data Tidak Ditemukan");
        return null
      }

      // Mapping hasil query
      let results = [];
      rows.forEach(row => {
        results.push(mapToThFinal2(row));
      });

      return results;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async findAllWithIdKeluarga(idKeluarga, tahun, connection) {
    try {
      let sql = `
        SELECT 
          a.id, 
          a.nominal, 
          a.id_keluarga, 
          a.keterangan, 
          a.created_by, 
          c.id_wilayah, 
          c.id_lingkungan, 
          a.updated_by, 
          a.sub_keterangan, 
          a.created_date, 
          a.updated_date, 
          a.bulan, 
          a.tahun,
          b.username, 
          d.kode_lingkungan, 
          d.nama_lingkungan, 
          e.kode_wilayah, 
          e.nama_wilayah
        FROM riwayat_transaksi a
        JOIN users b ON a.created_by = b.id
        JOIN data_keluarga c ON a.id_keluarga = c.id
        JOIN lingkungan d ON c.id_lingkungan = d.id
        JOIN wilayah e ON c.id_wilayah = e.id
        WHERE a.id_keluarga = ?
      `;

      let params = [idKeluarga];

      if (tahun) {
        sql += " AND a.tahun = ?";
        params.push(tahun);
      }

      sql += " ORDER BY a.created_date ASC";

      const [rows] = await connection.execute(sql, params);

      if (rows.length === 0) {
        // throw createHttpError(404, "Data Tidak Ditemukan");
        return null
      }

      // Mapping hasil query
      let results = [];
      rows.forEach(row => {
        results.push(mapToThFinal(row));
      });

      return results;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async findAllHistoryWithTimeFilter(tahun, bulan, idLingkungan, idWilayah, connection) {
    try {
      let sql = `
        SELECT 
          a.id, 
          a.nominal, 
          a.id_keluarga, 
          a.keterangan, 
          a.created_by, 
          c.id_wilayah, 
          c.id_lingkungan, 
          a.updated_by, 
          a.sub_keterangan, 
          a.created_date, 
          a.updated_date, 
          a.bulan, 
          a.tahun,
          b.username, 
          d.kode_lingkungan, 
          d.nama_lingkungan, 
          e.kode_wilayah, 
          e.nama_wilayah
        FROM riwayat_transaksi a
        JOIN users b ON a.created_by = b.id
        JOIN data_keluarga c ON a.id_keluarga = c.id
        JOIN lingkungan d ON c.id_lingkungan = d.id
        JOIN wilayah e ON c.id_wilayah = e.id
        WHERE a.tahun = ? AND a.bulan = ?
      `;

      let params = [tahun, bulan];

      if (idLingkungan) {
        sql += " AND c.id_lingkungan = ?";
        params.push(idLingkungan);
      }

      if (idWilayah) {
        sql += " AND c.id_wilayah = ?";
        params.push(idWilayah);
      }

      sql += " ORDER BY a.created_date ASC";

      const [rows] = await connection.execute(sql, params);

      if (rows.length === 0) {
        return null;
      }

      // Mapping hasil query
      let results = [];
      rows.forEach(row => {
        results.push(mapToThFinal(row));
      });

      return results;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async update(idTh, requestBody, connection) {
    try {
      if (isNaN(idTh)) {
        throw createHttpError(400, "Invalid TH, it must be an integer");
      }

      const { nominal, keterangan, subKeterangan, idKeluarga, updatedBy } = requestBody;
      const currentTime = new Date();

      let setClauses = [];
      let params = [];

      if (nominal !== undefined) {
        setClauses.push("nominal = ?");
        params.push(nominal);
      }
      if (keterangan) {
        setClauses.push("keterangan = ?");
        params.push(keterangan);
      }
      if (subKeterangan) {
        setClauses.push("sub_keterangan = ?");
        params.push(subKeterangan);
      }
      if (idKeluarga !== undefined) {
        setClauses.push("id_keluarga = ?");
        params.push(idKeluarga);
      }

      if (setClauses.length === 0) {
        throw createHttpError(400, "No fields to update");
      }

      setClauses.push("updated_by = ?");
      params.push(updatedBy);
      setClauses.push("updated_date = ?");
      params.push(currentTime);

      let sql = `UPDATE riwayat_transaksi SET ${setClauses.join(", ")} WHERE id = ?`;
      params.push(idTh);

      const [result] = await connection.execute(sql, params);

      if (result.affectedRows === 0) {
        throw createHttpError(404, "Transaction history not found");
      }

      return {
        Id: idTh,
        IdKeluarga: idKeluarga,
        Keterangan: keterangan,
        SubKeterangan: subKeterangan,
        UpdatedDate: currentTime,
        UpdatorId: updatedBy,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal untuk update data riwayat transaksi: ${error.message}`);
    }
  }

  async deleteOne(idTh, connection) {
    try {
      if (isNaN(idTh)) {
        throw createHttpError(400, "Invalid TH, it must be an integer");
      }

      const sqlScript = "DELETE FROM riwayat_transaksi WHERE id = ?";
      const [result] = await connection.execute(sqlScript, [idTh]);

      if (result.affectedRows === 0) {
        throw createHttpError(404, "Data tidak ditemukan atau sudah dihapus");
      }

      return { Id: idTh };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal menghapus data riwayat transaksi: ${error.message}`);
    }
  }

  // Add Iuran (Batch)
  async addBatch(historyData, file, connection) {
    try {
      if (!Array.isArray(historyData) || historyData.length === 0) {
        throw createHttpError(400, "Invalid history data");
      }

      let filePath = null;
      let lastInsertIdAddFile = null;

      if (file) {
        filePath = await saveFile(file);
        const [result] = await connection.execute(
          "INSERT INTO grouped_transaksi(file) VALUES(?)",
          [filePath]
        );
        lastInsertIdAddFile = result.insertId;
      }

      const sqlScript = `
        INSERT INTO riwayat_transaksi(nominal, id_keluarga, keterangan, created_by, sub_keterangan, created_date, bulan, tahun, group_id)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const responses = [];
      for (const history of historyData) {
        const {
          Nominal,
          IdKeluarga,
          Keterangan,
          CreatedBy,
          SubKeterangan,
          Bulan,
          Tahun,
        } = history;
        const createdDate = new Date();

        const [result] = await connection.execute(sqlScript, [
          Nominal,
          IdKeluarga,
          Keterangan,
          CreatedBy,
          SubKeterangan,
          createdDate,
          Bulan,
          Tahun,
          lastInsertIdAddFile,
        ]);

        responses.push({
          Id: result.insertId,
          Nominal,
          IdKeluarga,
          Keterangan,
          CreatorId: CreatedBy,
          SubKeterangan,
          CreatedDate: createdDate,
          Group: lastInsertIdAddFile,
        });
      }

      return responses;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal menambahkan batch transaksi: ${error.message}`);
    }
  }
  
  // Add Santunan
  async addSantunan(formData, file, connection) {
    try {
      const {
        Nominal,
        IdKeluarga,
        Keterangan,
        CreatedBy,
        SubKeterangan,
        Bulan,
        Tahun,
      } = formData;

      if (!Nominal || !IdKeluarga || !Keterangan || !CreatedBy || !Bulan || !Tahun) {
        throw createHttpError(400, "Missing required fields");
      }

      const currentTime = new Date();
      let filePath = null;
      let lastInsertIdAddFile = null;

      if (file) {
        filePath = await saveFile(file);
        const [result] = await connection.execute(
          "INSERT INTO grouped_transaksi(file) VALUES(?)",
          [filePath]
        );
        lastInsertIdAddFile = result.insertId;
      }

      const sqlScript = `
        INSERT INTO riwayat_transaksi(nominal, id_keluarga, keterangan, created_by, sub_keterangan, created_date, bulan, tahun, group_id)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await connection.execute(sqlScript, [
        Nominal,
        IdKeluarga,
        Keterangan,
        CreatedBy,
        SubKeterangan,
        currentTime,
        Bulan,
        Tahun,
        lastInsertIdAddFile,
      ]);

      return {
        Id: result.insertId,
        Nominal,
        IdKeluarga,
        Keterangan,
        CreatorId: CreatedBy,
        SubKeterangan,
        CreatedDate: currentTime,
        Group: lastInsertIdAddFile,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal menambahkan transaksi: ${error.message}`);
    }
  }

}

module.exports = TransactionHistoryRepository;