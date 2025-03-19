const addLingkunganOrWilayahQueryHelper = (sql, idWilayah, idLingkungan) => {
  let query = sql;
  let params = [];

  if (idWilayah) {
    query += " AND b.id_wilayah = ?";
    params.push(idWilayah);
  }

  if (idLingkungan) {
    query += " AND b.id_lingkungan = ?";
    params.push(idLingkungan);
  }

  return { query, params };
};

const convertToInterfaceArray = (ids) => {
    return ids.map((id) => id);
  }

module.exports = { addLingkunganOrWilayahQueryHelper, convertToInterfaceArray };
