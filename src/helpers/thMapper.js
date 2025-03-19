const mapToThFinal = (dataThRaw) => {
  return {
    Id: dataThRaw.Id,
    Nominal: dataThRaw.Nominal,
    IdKeluarga: dataThRaw.IdKeluarga,
    Keterangan: dataThRaw.Keterangan,
    Creator: {
      Id: dataThRaw.CreatorId,
      Username: dataThRaw.UserName,
    },
    Wilayah: {
      Id: dataThRaw.IdWilayah,
      KodeWilayah: dataThRaw.KodeWilayah,
      NamaWilayah: dataThRaw.NamaWilayah,
    },
    Lingkungan: {
      Id: dataThRaw.IdLingkungan,
      KodeLingkungan: dataThRaw.KodeLingkungan,
      NamaLingkungan: dataThRaw.NamaLingkungan,
      Wilayah: dataThRaw.IdWilayah,
    },
    UpdatorId: dataThRaw.UpdatorId ?? 0, // Jika NULL, default ke 0
    SubKeterangan: dataThRaw.SubKeterangan ?? "", // Jika NULL, default ke string kosong
    CreatedDate: dataThRaw.CreatedDate,
    UpdatedDate: dataThRaw.UpdatedDate,
    Bulan: dataThRaw.Bulan,
    Tahun: dataThRaw.Tahun,
    GroupId: dataThRaw.GroupId,
    File: dataThRaw.File ?? "", // Jika NULL, default ke string kosong
  };
};

const mapToThFinal2 = (dataThRaw) => {
  return {
    Id: dataThRaw.Id,
    Nominal: dataThRaw.Nominal,
    IdKeluarga: dataThRaw.IdKeluarga,
    Keterangan: dataThRaw.Keterangan,
    Creator: {
      Id: dataThRaw.CreatorId,
      Username: dataThRaw.UserName,
    },
    Wilayah: {
      Id: dataThRaw.IdWilayah,
      KodeWilayah: dataThRaw.KodeWilayah,
      NamaWilayah: dataThRaw.NamaWilayah,
    },
    Lingkungan: {
      Id: dataThRaw.IdLingkungan,
      KodeLingkungan: dataThRaw.KodeLingkungan,
      NamaLingkungan: dataThRaw.NamaLingkungan,
      Wilayah: dataThRaw.IdWilayah,
    },
    UpdatorId: dataThRaw.UpdatorId ?? 0, // Jika NULL, default ke 0
    SubKeterangan: dataThRaw.SubKeterangan ?? "", // Jika NULL, default ke string kosong
    CreatedDate: dataThRaw.CreatedDate,
    UpdatedDate: dataThRaw.UpdatedDate,
    Bulan: dataThRaw.Bulan,
    Tahun: dataThRaw.Tahun,
    GroupId: dataThRaw.GroupId,
    NamaKepalaKeluarga: dataThRaw.NamaKepalaKeluarga ?? "", // Jika NULL, default ke string kosong
  };
};

module.exports = { mapToThFinal, mapToThFinal2 };
