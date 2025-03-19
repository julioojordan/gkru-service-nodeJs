const createHttpError = require("http-errors");
const DataAnggotaRepository = require("./dataAnggotaRepository");

class DataKeluargaRepository {
  constructor() {}

  async findOne(idKeluarga, connection) {
    try {
      const sql = `
        SELECT k.id, k.id_wilayah, k.id_lingkungan, k.nomor, k.id_kepala_keluarga, 
               k.alamat, k.status, k.nomor_kk_gereja, 
               l.kode_lingkungan, l.nama_lingkungan, 
               w.kode_wilayah, w.nama_wilayah
        FROM data_keluarga k
        JOIN lingkungan l ON k.id_lingkungan = l.id
        JOIN wilayah w ON k.id_wilayah = w.id
        WHERE k.id = ?
      `;

      const [rows] = await connection.execute(sql, [idKeluarga]);

      if (rows.length === 0) {
        throw createHttpError(404, "Data Keluarga tidak ditemukan");
      }

      const dataKeluargaRaw = rows[0];

      // Ambil data anggota keluarga
      const sqlAnggota = `
        SELECT a.id, a.nama_lengkap, a.tanggal_lahir, a.tanggal_baptis, 
               a.keterangan, a.status, a.jenis_kelamin, a.no_telp, 
               r.hubungan 
        FROM keluarga_anggota_rel r
        JOIN data_anggota a ON r.id_anggota = a.id
        WHERE r.id_keluarga = ?
      `;

      const [anggotaRows] = await connection.execute(sqlAnggota, [idKeluarga]);

      let kepalaKeluarga = null;
      const anggota = [];

      anggotaRows.forEach((anggotaRel) => {
        const anggotaData = {
          Id: anggotaRel.id,
          NamaLengkap: anggotaRel.nama_lengkap,
          TanggalLahir: anggotaRel.tanggal_lahir,
          TanggalBaptis: anggotaRel.tanggal_baptis,
          Keterangan: anggotaRel.keterangan,
          Status: anggotaRel.status,
          JenisKelamin: anggotaRel.jenis_kelamin,
          NoTelp: anggotaRel.no_telp,
        };

        if (anggotaRel.hubungan === "Kepala Keluarga") {
          kepalaKeluarga = anggotaData;
        } else {
          anggota.push(anggotaData);
        }
      });

      return {
        Id: dataKeluargaRaw.id,
        Wilayah: {
          Id: dataKeluargaRaw.id_wilayah,
          KodeWilayah: dataKeluargaRaw.kode_wilayah,
          NamaWilayah: dataKeluargaRaw.nama_wilayah,
        },
        Lingkungan: {
          Id: dataKeluargaRaw.id_lingkungan,
          KodeLingkungan: dataKeluargaRaw.kode_lingkungan,
          NamaLingkungan: dataKeluargaRaw.nama_lingkungan,
        },
        Nomor: dataKeluargaRaw.nomor,
        KepalaKeluarga: kepalaKeluarga,
        Alamat: dataKeluargaRaw.alamat,
        Anggota: anggota,
        Status: dataKeluargaRaw.status,
        NomorKKGereja: dataKeluargaRaw.nomor_kk_gereja,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(
        500,
        `Gagal mendapatkan data keluarga: ${error.message}`
      );
    }
  }

  async findAll(filters = {}, connection) {
    try {
      let sql = `
        SELECT k.id, k.id_wilayah, k.id_lingkungan, k.nomor, k.id_kepala_keluarga, 
               k.alamat, k.status, k.nomor_kk_gereja, 
               l.kode_lingkungan, l.nama_lingkungan, 
               w.kode_wilayah, w.nama_wilayah
        FROM data_keluarga k
        JOIN lingkungan l ON k.id_lingkungan = l.id
        JOIN wilayah w ON k.id_wilayah = w.id
      `;

      const conditions = [];
      const params = [];

      // Filter berdasarkan idLingkungan
      if (filters.idLingkungan) {
        conditions.push("k.id_lingkungan = ?");
        params.push(filters.idLingkungan);
      }

      // Filter berdasarkan idWilayah
      if (filters.idWilayah) {
        conditions.push("k.id_wilayah = ?");
        params.push(filters.idWilayah);
      }

      // Tambahkan kondisi ke query jika ada filter
      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      const [rows] = await connection.execute(sql, params);

      if (rows.length === 0) {
        return [];
      }

      const dataKeluargaList = [];

      for (const dataKeluargaRaw of rows) {
        // Ambil data anggota keluarga
        const sqlAnggota = `
          SELECT a.id, a.nama_lengkap, a.tanggal_lahir, a.tanggal_baptis, 
                 a.keterangan, a.status, a.jenis_kelamin, a.no_telp, 
                 r.hubungan 
          FROM keluarga_anggota_rel r
          JOIN data_anggota a ON r.id_anggota = a.id
          WHERE r.id_keluarga = ?
        `;

        const [anggotaRows] = await connection.execute(sqlAnggota, [
          dataKeluargaRaw.id,
        ]);

        let kepalaKeluarga = null;
        const anggota = [];

        anggotaRows.forEach((anggotaRel) => {
          const anggotaData = {
            Id: anggotaRel.id,
            NamaLengkap: anggotaRel.nama_lengkap,
            TanggalLahir: anggotaRel.tanggal_lahir,
            TanggalBaptis: anggotaRel.tanggal_baptis,
            Keterangan: anggotaRel.keterangan,
            Status: anggotaRel.status,
            JenisKelamin: anggotaRel.jenis_kelamin,
            NoTelp: anggotaRel.no_telp,
          };

          if (anggotaRel.hubungan === "Kepala Keluarga") {
            kepalaKeluarga = anggotaData;
          } else {
            anggota.push(anggotaData);
          }
        });

        dataKeluargaList.push({
          Id: dataKeluargaRaw.id,
          Wilayah: {
            Id: dataKeluargaRaw.id_wilayah,
            KodeWilayah: dataKeluargaRaw.kode_wilayah,
            NamaWilayah: dataKeluargaRaw.nama_wilayah,
          },
          Lingkungan: {
            Id: dataKeluargaRaw.id_lingkungan,
            KodeLingkungan: dataKeluargaRaw.kode_lingkungan,
            NamaLingkungan: dataKeluargaRaw.nama_lingkungan,
          },
          Nomor: dataKeluargaRaw.nomor,
          KepalaKeluarga: kepalaKeluarga,
          Alamat: dataKeluargaRaw.alamat,
          Anggota: anggota,
          Status: dataKeluargaRaw.status,
          NomorKKGereja: dataKeluargaRaw.nomor_kk_gereja,
        });
      }

      return dataKeluargaList;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(
        500,
        `Gagal mendapatkan data keluarga: ${error.message}`
      );
    }
  }

  async getTotalWithFilter(filters = {}, connection) {
    try {
      let sql =
        "SELECT COUNT(*) AS total FROM data_keluarga WHERE status = 'aktif'";
      const params = [];

      // Append filter conditions dynamically // TODO kayanya buatin helper buat create filter ini ya dari query param atau path variable
      if (filters.idWilayah) {
        sql += " AND id_wilayah = ?";
        params.push(filters.idWilayah);
      }
      if (filters.idLingkungan) {
        sql += " AND id_lingkungan = ?";
        params.push(filters.idLingkungan);
      }

      // Execute query
      const [rows] = await connection.execute(sql, params);

      if (rows.length === 0) {
        throw createHttpError(500, "Data Tidak Ditemukan");
      }

      return { Total: rows[0].total };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(
        500,
        `Gagal mendapatkan total keluarga: ${error.message}`
      );
    }
  }

  async getTotal(connection) {
    try {
      const sql =
        "SELECT COUNT(*) AS total FROM data_keluarga WHERE status = 'aktif'";

      // Execute query
      const [rows] = await connection.execute(sql);

      if (rows.length === 0) {
        throw createHttpError(500, "Data Tidak Ditemukan");
      }

      return { Total: rows[0].total };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(
        500,
        `Gagal mendapatkan total keluarga: ${error.message}`
      );
    }
  }

  async add(request, connection) {
    const { idWilayah, idLingkungan, nomor, alamat, nomorKKGereja } = request;

    try {
      // 1. Tambah data anggota (kepala keluarga) dulu
      // ini diubah jadi method static aja
      const kepalaKeluarga = await DataAnggotaRepository.addAnggota(
        request,
        connection
      );

      // 2. Tambah data keluarga
      const sqlInsert = `
        INSERT INTO data_keluarga(id_wilayah, id_lingkungan, nomor, id_kepala_keluarga, alamat, nomor_kk_gereja) 
        VALUES(?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(sqlInsert, [
        idWilayah,
        idLingkungan,
        nomor,
        kepalaKeluarga.Id,
        alamat,
        nomorKKGereja,
      ]);

      if (!result.insertId) {
        throw createHttpError(500, "Gagal memasukkan data keluarga");
      }

      const lastInsertId = result.insertId;

      // 3. Update relasi kepala keluarga
      const sqlUpdate = `UPDATE keluarga_anggota_rel SET id_keluarga = ? WHERE id_anggota = ?`;
      await connection.execute(sqlUpdate, [lastInsertId, kepalaKeluarga.Id]);

      return {
        Id: lastInsertId,
        Wilayah: idWilayah,
        Lingkungan: idLingkungan,
        Nomor: nomor,
        KepalaKeluarga: kepalaKeluarga.Id,
        Alamat: alamat,
        NomorKKGereja: nomorKKGereja,
      };
    } catch (error) {
      throw createHttpError(
        500,
        `Gagal menambahkan data keluarga: ${error.message}`
      );
    }
  }

  async updateDataKeluarga(idKeluarga, request, connection) {
    const {
      idWilayah,
      idLingkungan,
      nomor,
      alamat,
      status,
      nomorKKGereja,
      idKepalaKeluarga,
      oldIdKepalaKeluarga,
    } = request;

    try {
      // 1. Membangun query dinamis
      let sqlUpdate = "UPDATE data_keluarga SET ";
      let params = [];
      let setClauses = [];

      if (idWilayah) {
        setClauses.push("id_wilayah = ?");
        params.push(idWilayah);
      }
      if (idLingkungan) {
        setClauses.push("id_lingkungan = ?");
        params.push(idLingkungan);
      }
      if (nomor) {
        setClauses.push("nomor = ?");
        params.push(nomor);
      }
      if (alamat) {
        setClauses.push("alamat = ?");
        params.push(alamat);
      }
      if (status) {
        setClauses.push("status = ?");
        params.push(status);
      }
      if (nomorKKGereja) {
        setClauses.push("nomor_kk_gereja = ?");
        params.push(nomorKKGereja);
      }
      if (idKepalaKeluarga) {
        setClauses.push("id_kepala_keluarga = ?");
        params.push(idKepalaKeluarga);
      }

      if (setClauses.length === 0) {
        throw createHttpError(400, "Tidak ada field yang diperbarui");
      }

      sqlUpdate += setClauses.join(", ") + " WHERE id = ?";
      params.push(idKeluarga);

      // 2. Eksekusi query update
      const [updateResult] = await connection.execute(sqlUpdate, params);
      if (updateResult.affectedRows === 0) {
        throw createHttpError(404, "Gagal untuk update data keluarga : Data keluarga tidak ditemukan");
      }

      // 3. Update relasi kepala keluarga jika ID berubah
      let isKepalaKeluargaUpdated = false;
      if (idKepalaKeluarga && idKepalaKeluarga !== oldIdKepalaKeluarga) {
        isKepalaKeluargaUpdated = true;
      }

      if (isKepalaKeluargaUpdated) {
        await DataAnggotaRepository.updateKeteranganAnggota(
          idKepalaKeluarga,
          connection
        );
      }

      // 5. Ambil data anggota keluarga setelah update // TODO ini belum dibuat method nya
      const anggotaKeluarga =
        await this.repositories.DataAnggotaKeluargaRelRepository.findKeluargaAnggotaRel(
          idKeluarga,
          connection
        );

      let kepalaKeluarga = null;
      let anggota = [];

      for (const anggotaRel of anggotaKeluarga) {
        const anggotaObj = {
          Id: anggotaRel.idAnggota,
          NamaLengkap: anggotaRel.namaLengkap,
          TanggalLahir: anggotaRel.tanggalLahir,
          TanggalBaptis: anggotaRel.tanggalBaptis,
          Keterangan: anggotaRel.keterangan,
          Status: anggotaRel.status,
          JenisKelamin: anggotaRel.jenisKelamin,
          NoTelp: anggotaRel.noTelp,
        };

        if (anggotaRel.hubungan === "Kepala Keluarga") {
          kepalaKeluarga = anggotaObj;
        } else {
          anggota.push(anggotaObj);
        }
      }

      return {
        Id: idKeluarga,
        IdWilayah: idWilayah,
        IdLingkungan: idLingkungan,
        Nomor : nomor,
        KepalaKeluarga: kepalaKeluarga,
        Alamat: alamat,
        Status: status,
        Anggota: anggota,
        NomorKKGereja: nomorKKGereja,
      };
    } catch (error) {
      throw createHttpError(
        500,
        `Gagal memperbarui data keluarga: ${error.message}`
      );
    }
  }

  async deleteDataKeluarga(idKeluarga, connection) {
    try {
      // Step 1: Ambil ID anggota dari keluarga_anggota_rel sebelum dihapus
      const [anggotaRows] = await connection.execute(
        "SELECT id_anggota FROM keluarga_anggota_rel WHERE id_keluarga = ?",
        [idKeluarga]
      );

      const deletedAnggotaIds = anggotaRows.map((row) => row.id_anggota);

      // Step 2: Hapus relasi dari tabel keluarga_anggota_rel
      await connection.execute(
        "DELETE FROM keluarga_anggota_rel WHERE id_keluarga = ?",
        [idKeluarga]
      );

      // Step 3: Hapus data keluarga dari tabel data_keluarga
      await connection.execute("DELETE FROM data_keluarga WHERE id = ?", [
        idKeluarga,
      ]);

      // Step 4: Hapus data anggota berdasarkan ID yang ditemukan sebelumnya
      if (deletedAnggotaIds.length > 0) {
        const placeholders = deletedAnggotaIds.map(() => "?").join(", ");
        await connection.execute(
          `DELETE FROM data_anggota WHERE id IN (${placeholders})`,
          deletedAnggotaIds
        );
      }

      return {
        Id: idKeluarga,
        DeletedAnggotaIds: deletedAnggotaIds,
      };
    } catch (error) {
      throw createHttpError(
        500,
        `Gagal menghapus data keluarga: ${error.message}`
      );
    }
  }
}

module.exports = DataKeluargaRepository;
