const mapToThFinal = (dataThRaw) => {
  return {
    Id: dataThRaw.id,
    Nominal: dataThRaw.nominal,
    IdKeluarga: dataThRaw.id_keluarga,
    Keterangan: dataThRaw.keterangan,
    Creator: {
      Id: dataThRaw.created_by,
      Username: dataThRaw.username,
      // KetuaLingkungan: dataThRaw. TODO kayanya 2 ini gak diperluin di th repo
      // KetuaWilayah: dataThRaw.
    },
    Wilayah: {
      Id: dataThRaw.id_wilayah,
      KodeWilayah: dataThRaw.kode_wilayah,
      NamaWilayah: dataThRaw.nama_wilayah,
    },
    Lingkungan: {
      Id: dataThRaw.id_lingkungan,
      KodeLingkungan: dataThRaw.kode_lingkungan,
      NamaLingkungan: dataThRaw.nama_lingkungan,
      Wilayah: dataThRaw.IdWilayah,
    },
    UpdatorId: dataThRaw.updated_by ?? 0, // Jika NULL, default ke 0
    SubKeterangan: dataThRaw.sub_keterangan ?? "", // Jika NULL, default ke string kosong
    CreatedDate: dataThRaw.created_date,
    UpdatedDate: dataThRaw.updated_date,
    Bulan: dataThRaw.bulan,
    Tahun: dataThRaw.tahun,
    GroupId: dataThRaw.group_id ?? 0,
    File: dataThRaw.file ?? "", // Jika NULL, default ke string kosong
  };
};

const mapToThFinal2 = (dataThRaw) => {
  return {
    Id: dataThRaw.id,
    Nominal: dataThRaw.nominal,
    IdKeluarga: dataThRaw.id_keluarga,
    Keterangan: dataThRaw.keterangan,
    Creator: {
      Id: dataThRaw.created_by,
      Username: dataThRaw.username,
    },
    Wilayah: {
      Id: dataThRaw.id_wilayah,
      KodeWilayah: dataThRaw.kode_wilayah,
      NamaWilayah: dataThRaw.nama_wilayah,
    },
    Lingkungan: {
      Id: dataThRaw.id_lingkungan,
      KodeLingkungan: dataThRaw.kode_lingkungan,
      NamaLingkungan: dataThRaw.nama_lingkungan,
      Wilayah: dataThRaw.IdWilayah,
    },
    UpdatorId: dataThRaw.updated_by ?? 0, // Jika NULL, default ke 0
    SubKeterangan: dataThRaw.sub_keterangan ?? "", // Jika NULL, default ke string kosong
    CreatedDate: dataThRaw.created_date,
    UpdatedDate: dataThRaw.updated_date,
    Bulan: dataThRaw.bulan,
    Tahun: dataThRaw.tahun,
    GroupId: dataThRaw.group_id ?? 0,
    NamaKepalaKeluarga: dataThRaw.nama_kepala_keluarga ?? "", // Jika NULL, default ke string kosong
  };
};

module.exports = { mapToThFinal, mapToThFinal2 };
