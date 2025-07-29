const createHttpError = require("http-errors");

class DataAnggotaRepository {
  constructor() {}

  async getTotal(connection) {
    try {
      const sql = `
        SELECT COUNT(*) AS total
        FROM data_anggota a
        JOIN keluarga_anggota_rel b ON a.id = b.id_anggota
        JOIN data_keluarga c ON b.id_keluarga = c.id
        WHERE a.status = 'HIDUP' AND c.status = 'aktif'
      `;

      const [rows] = await connection.execute(sql);

      if (rows.length === 0) {
        // throw createHttpError(500, "Data Tidak Ditemukan");
        return { Total: 0 };
      }

      return { Total: rows[0].total };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Gagal mengeksekusi query: ${error.message}`);
    }
  }

  async add(requestBody, connection) {
    return DataAnggotaRepository.addAnggota(requestBody, connection);
  }

  static async addAnggota(requestBody, connection) {
    try {
      const sql = `
        INSERT INTO data_anggota(nama_lengkap, tanggal_lahir, tanggal_baptis, keterangan, status, jenis_kelamin, no_telp, isBaptis, alasan_belum_baptis)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const tb =
        requestBody.tanggalBaptis && requestBody.tanggalBaptis.trim() !== ""
          ? requestBody.tanggalBaptis
          : null;
      const [result] = await connection.execute(sql, [
        requestBody.namaLengkap,
        requestBody.tanggalLahir,
        tb,
        requestBody.keterangan,
        requestBody.status,
        requestBody.jenisKelamin ?? "",
        requestBody.noTelp ?? "",
        requestBody.isBaptis,
        requestBody.alasanBelumBaptis,
      ]);

      const lastInsertId = result.insertId;

      const sqlRel = `
        INSERT INTO keluarga_anggota_rel (id_keluarga, id_anggota, hubungan)
        VALUES (?, ?, ?)
      `;

      await connection.execute(sqlRel, [
        requestBody.idKeluarga ?? null,
        lastInsertId,
        requestBody.hubungan,
      ]);

      return {
        Id: lastInsertId,
        NamaLengkap: requestBody.namaLengkap,
        Keterangan: requestBody.keterangan,
        TanggalLahir: requestBody.tanggalLahir,
        TanggalBaptis: tb,
        JenisKelamin: requestBody.jenisKelamin ?? "",
      };
    } catch (error) {
      throw createHttpError(
        500,
        `Gagal memasukkan data anggota: ${error.message}`
      );
    }
  }

  async findOne(idAnggota, connection) {
    try {
      const sql = `
        SELECT a.id, a.nama_lengkap, a.tanggal_lahir, a.tanggal_baptis, a.keterangan, 
               a.status, a.jenis_kelamin, a.no_telp, a.isBaptis, a.alasan_belum_baptis, b.id_keluarga, b.hubungan, 
               c.id_wilayah, c.id_lingkungan, d.kode_lingkungan, d.nama_lingkungan, 
               e.kode_wilayah, e.nama_wilayah 
        FROM data_anggota a 
        JOIN keluarga_anggota_rel b ON a.id = b.id_anggota 
        JOIN data_keluarga c ON b.id_keluarga = c.id
        JOIN lingkungan d ON c.id_lingkungan = d.id
        JOIN wilayah e ON c.id_wilayah = e.id
        WHERE a.id = ?
      `;

      const [rows] = await connection.execute(sql, [idAnggota]);

      if (rows.length === 0) {
        throw createHttpError(500, "Data Tidak Ditemukan");
      }

      return {
        Id: rows[0].id,
        NamaLengkap: rows[0].nama_lengkap,
        TanggalLahir: rows[0].tanggal_lahir,
        TanggalBaptis: rows[0].tanggal_baptis,
        Keterangan: rows[0].keterangan,
        Status: rows[0].status,
        JenisKelamin: rows[0].jenis_kelamin,
        NoTelp: rows[0].no_telp,
        IdKeluarga: rows[0].id_keluarga,
        Hubungan: rows[0].hubungan,
        IdWilayah: rows[0].id_wilayah,
        IdLingkungan: rows[0].id_lingkungan,
        KodeLingkungan: rows[0].kode_lingkungan,
        NamaLingkungan: rows[0].nama_lingkungan,
        KodeWilayah: rows[0].kode_wilayah,
        NamaWilayah: rows[0].nama_wilayah,
        IsBaptis: rows[0].isBaptis,
        AlasanBelumBaptis: rows[0].alasan_belum_baptis,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(
        500,
        `Gagal mendapatkan data anggota: ${error.message}`
      );
    }
  }

  async findAll(filters, connection) {
    try {
      let sql = `
        SELECT a.id, a.nama_lengkap, a.tanggal_lahir, a.tanggal_baptis, a.keterangan, 
               a.status, a.jenis_kelamin, a.no_telp, a.isBaptis, a.alasan_belum_baptis, b.id_keluarga, b.hubungan, 
               c.id_wilayah, c.id_lingkungan, d.kode_lingkungan, d.nama_lingkungan, 
               e.kode_wilayah, e.nama_wilayah 
        FROM data_anggota a 
        JOIN keluarga_anggota_rel b ON a.id = b.id_anggota 
        JOIN data_keluarga c ON b.id_keluarga = c.id
        JOIN lingkungan d ON c.id_lingkungan = d.id
        JOIN wilayah e ON c.id_wilayah = e.id
      `;

      const conditions = [];
      const args = [];

      if (filters.idLingkungan) {
        conditions.push("c.id_lingkungan = ?");
        args.push(filters.idLingkungan);
      }
      if (filters.idWilayah) {
        conditions.push("c.id_wilayah = ?");
        args.push(filters.idWilayah);
      }

      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      const [rows] = await connection.execute(sql, args);
      return rows.map((row) => ({
        Id: row.id,
        NamaLengkap: row.nama_lengkap,
        TanggalLahir: row.tanggal_lahir,
        TanggalBaptis: row.tanggal_baptis,
        Keterangan: row.keterangan,
        Status: row.status,
        JenisKelamin: row.jenis_kelamin,
        NoTelp: row.no_telp,
        IdKeluarga: row.id_keluarga,
        Hubungan: row.hubungan,
        IdWilayah: row.id_wilayah,
        IdLingkungan: row.id_lingkungan,
        KodeLingkungan: row.kode_lingkungan,
        NamaLingkungan: row.nama_lingkungan,
        KodeWilayah: row.kode_wilayah,
        NamaWilayah: row.nama_wilayah,
        IsBaptis: row.isBaptis,
        AlasanBelumBaptis: row.alasan_belum_baptis,
      }));
    } catch (error) {
      throw createHttpError(
        500,
        `Gagal mendapatkan data anggota: ${error.message}`
      );
    }
  }

  async findAllWithIdKeluarga(filters, connection) {
    try {
      let sql = `
        SELECT a.id, a.nama_lengkap, a.tanggal_lahir, a.tanggal_baptis, a.keterangan, 
               a.status, a.jenis_kelamin, a.no_telp, a.isBaptis, a.alasan_belum_baptis, b.id_keluarga, b.hubungan, 
               c.id_wilayah, c.id_lingkungan, d.kode_lingkungan, d.nama_lingkungan, 
               e.kode_wilayah, e.nama_wilayah 
        FROM data_anggota a 
        JOIN keluarga_anggota_rel b ON a.id = b.id_anggota 
        JOIN data_keluarga c ON b.id_keluarga = c.id
        JOIN lingkungan d ON c.id_lingkungan = d.id
        JOIN wilayah e ON c.id_wilayah = e.id
      `;

      const conditions = [];
      const args = [];

      if (filters.idLingkungan) {
        conditions.push("c.id_lingkungan = ?");
        args.push(filters.idLingkungan);
      }
      if (filters.idWilayah) {
        conditions.push("c.id_wilayah = ?");
        args.push(filters.idWilayah);
      }
      if (filters.idKeluarga) {
        conditions.push("c.id = ?");
        args.push(filters.idKeluarga);
      }

      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      const [rows] = await connection.execute(sql, args);
      return rows.map((row) => ({
        Id: row.id,
        NamaLengkap: row.nama_lengkap,
        TanggalLahir: row.tanggal_lahir,
        TanggalBaptis: row.tanggal_baptis,
        Keterangan: row.keterangan,
        Status: row.status,
        JenisKelamin: row.jenis_kelamin,
        NoTelp: row.no_telp,
        IdKeluarga: row.id_keluarga,
        Hubungan: row.hubungan,
        IdWilayah: row.id_wilayah,
        IdLingkungan: row.id_lingkungan,
        KodeLingkungan: row.kode_lingkungan,
        NamaLingkungan: row.nama_lingkungan,
        KodeWilayah: row.kode_wilayah,
        NamaWilayah: row.nama_wilayah,
        IsBaptis: row.isBaptis,
        AlasanBelumBaptis: row.alasan_belum_baptis,
      }));
    } catch (error) {
      throw createHttpError(
        500,
        `Gagal mendapatkan data anggota: ${error.message}`
      );
    }
  }

  async updateKepalaKeluarga(idKeluarga, idAnggota, connection) {
    try {
      // Query untuk mencari anggota dengan keterangan "Istri"
      const getIstriQuery = `
        SELECT a.id FROM data_anggota a 
        JOIN keluarga_anggota_rel b ON a.id = b.id_anggota
        WHERE b.id_keluarga = ? 
        AND a.keterangan LIKE ?`;
      const [istriResult] = await connection.execute(getIstriQuery, [
        idKeluarga,
        "%Istri%",
      ]);

      let idAnggotaBaru = istriResult.length > 0 ? istriResult[0].id : null;

      // Jika tidak ada anggota dengan keterangan "Istri", cari anggota tertua yang masih hidup
      if (!idAnggotaBaru) {
        const getOldestAnggotaQuery = `
          SELECT a.id FROM data_anggota a 
          JOIN keluarga_anggota_rel b ON a.id = b.id_anggota
          WHERE b.id_keluarga = ?
          AND a.keterangan NOT LIKE "%Kepala Keluarga%"
          AND a.status = 'HIDUP'
          ORDER BY a.tanggal_lahir ASC LIMIT 1`;
        const [oldestResult] = await connection.execute(getOldestAnggotaQuery, [
          idKeluarga,
        ]);

        if (oldestResult.length > 0) {
          idAnggotaBaru = oldestResult[0].id;
        } else {
          throw createHttpError(
            404,
            "Tidak ada anggota yang bisa menjadi Kepala Keluarga lagi"
          );
        }
      }

      // Query untuk update kepala keluarga yang baru
      const updateDataAnggotaQuery = `
        UPDATE data_anggota 
        SET keterangan = 'Kepala Keluarga' 
        WHERE id = ?`;
      await connection.execute(updateDataAnggotaQuery, [idAnggotaBaru]);

      // Update relation kepala keluarga yang baru
      const updateDataRelationQuery = `
        UPDATE keluarga_anggota_rel 
        SET hubungan = 'Kepala Keluarga' 
        WHERE id_anggota = ?`;
      await connection.execute(updateDataRelationQuery, [idAnggotaBaru]);

      // Update id kepala keluarga di data_keluarga
      const updateDataKeluargaQuery = `
        UPDATE data_keluarga 
        SET id_kepala_keluarga = ? 
        WHERE id = ?`;
      await connection.execute(updateDataKeluargaQuery, [
        idAnggotaBaru,
        idKeluarga,
      ]);

      // Jika dari update bukan delete, update keterangan anggota lama menjadi "Anggota"
      if (idAnggota) {
        await connection.execute(
          "UPDATE data_anggota SET keterangan = 'Anggota' WHERE id = ?",
          [idAnggota]
        );
        await connection.execute(
          "UPDATE keluarga_anggota_rel SET hubungan = 'Anggota' WHERE id_anggota = ?",
          [idAnggota]
        );
      }

      return { idKepalaKeluargaBaru: idAnggotaBaru };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(
        500,
        `Gagal memperbarui Kepala Keluarga: ${error.message}`,
        {
          expose: true,
        }
      );
    }
  }

  async update(idAnggota, data, connection) {
    try {
      const updates = [];
      const params = [];

      if (data.namaLengkap) {
        updates.push("nama_lengkap = ?");
        params.push(data.namaLengkap);
      }
      if (data.tanggalLahir) {
        updates.push("tanggal_lahir = ?");
        params.push(data.tanggalLahir);
      }
      if (data.tanggalBaptis) {
        updates.push("tanggal_baptis = ?");
        const tb =
        data.tanggalBaptis && data.tanggalBaptis.trim() !== ""
          ? data.tanggalBaptis
          : null;
        params.push(tb);
      }
      if (data.noTelp) {
        updates.push("no_telp = ?");
        params.push(data.noTelp);
      }
      if (data.keterangan) {
        updates.push("keterangan = ?");
        params.push(data.keterangan);
      }
      if (data.status) {
        updates.push("status = ?");
        params.push(data.status);
      }
      if (data.jenisKelamin) {
        updates.push("jenis_kelamin = ?");
        params.push(data.jenisKelamin);
      }
      if (data.isBaptis !== null) {
        updates.push("isBaptis = ?");
        const bap = data.isBaptis ? 1 : 0;
        params.push(data.isBaptis);
      }
      if (data.isBaptis == true) {
        updates.push("alasan_belum_baptis = ?");
        params.push(null);
      }
      
      if (data.isBaptis == false) {
        updates.push("tanggal_baptis = ?");
        params.push(null);
      }

      if (data.alasanBelumBaptis) {
        updates.push("alasan_belum_baptis = ?");
        params.push(data.alasanBelumBaptis);
      }

      if (updates.length === 0) {
        throw createHttpError(400, "No fields to update");
      }

      params.push(idAnggota);
      const sql = `UPDATE data_anggota SET ${updates.join(", ")} WHERE id = ?`;
      await connection.execute(sql, params);

      // Update hubungan jika ada
      if (data.hubungan) {
        const sqlRel = `UPDATE keluarga_anggota_rel SET hubungan = ? WHERE id_anggota = ?`;
        await connection.execute(sqlRel, [data.hubungan, idAnggota]);
      }

      // Jika anggota meninggal dan dia kepala keluarga, update kepala keluarga baru
      if (data.status === "MENINGGAL" && data.isKepalaKeluarga) {
        await this.updateKepalaKeluarga(data.idKeluarga, idAnggota, connection);
      }

      return {
        Id: parseInt(idAnggota, 10),
        NamaLengkap: data.namaLengkap,
        TanggalLahir: data.tanggalLahir,
        TanggalBaptis: data.tanggalBaptis,
        Keterangan: data.keterangan,
        Status: data.status,
        JenisKelamin: data.jenisKelamin,
        NoTelp: data.noTelp,
        IsBaptis: data.isBaptis,
        AlasanBelumBaptis: data.alasanBelumBaptis,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to update data: ${error.message}`, {
        expose: true,
      });
    }
  }

  static async updateKeteranganAnggota(data, connection) {
    try {
      const sqlUpdateAnggota = `UPDATE data_anggota SET keterangan = ? WHERE id = ?`;
      const sqlUpdateRelasi = `UPDATE keluarga_anggota_rel SET hubungan = ? WHERE id_anggota = ?`;

      // Update anggota baru menjadi "Kepala Keluarga"
      await connection.execute(sqlUpdateAnggota, [
        "Kepala Keluarga",
        data.idKepalaKeluarga,
      ]);
      await connection.execute(sqlUpdateRelasi, [
        "Kepala Keluarga",
        data.idKepalaKeluarga,
      ]);

      // Update anggota lama menjadi "Anggota"
      await connection.execute(sqlUpdateAnggota, [
        "Anggota",
        data.oldIdKepalaKeluarga,
      ]);
      await connection.execute(sqlUpdateRelasi, [
        "Anggota",
        data.oldIdKepalaKeluarga,
      ]);

      return {
        Id: data.idKepalaKeluarga,
        Keterangan: "Kepala Keluarga",
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to update data: ${error.message}`, {
        expose: true,
      });
    }
  }

  async deleteOne(idAnggota, connection) {
    try {
      // Step 1: Ambil data anggota berdasarkan ID
      const [dataAnggota] = await connection.execute(
        `SELECT id_keluarga, hubungan FROM keluarga_anggota_rel WHERE id_anggota = ?`,
        [idAnggota]
      );

      if (dataAnggota.length === 0) {
        throw createHttpError(404, "Data anggota tidak ditemukan");
      }

      const { id_keluarga: idKeluarga, hubungan } = dataAnggota[0];

      // Step 2: Hapus data dari `keluarga_anggota_rel`
      await connection.execute(
        `DELETE FROM keluarga_anggota_rel WHERE id_anggota = ?`,
        [idAnggota]
      );

      // Step 3: Jika yang dihapus adalah Kepala Keluarga, update Kepala Keluarga baru
      if (hubungan === "Kepala Keluarga") {
        await this.updateKepalaKeluarga(idKeluarga, null, connection);
      }

      // Step 4: Hapus data dari `data_anggota`
      await connection.execute(`DELETE FROM data_anggota WHERE id = ?`, [
        idAnggota,
      ]);

      return { Id: idAnggota };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Failed to delete data: ${error.message}`, {
        expose: true,
      });
    }
  }
}

module.exports = DataAnggotaRepository;
