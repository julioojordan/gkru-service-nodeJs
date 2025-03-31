const DataWilayahRepository = require("./dataWilayahRepository")
const DataAnggotaRepository = require("./dataAnggotaRepository")
const DataLingkunganRepository = require("./dataLingkunganRepository")
const DataKeluargaRepository = require("./dataKeluargaRepository")
const UserRepository = require("./userRepository")
const TransactionHistoryRepository = require("./transactionHistoryRepository")

module.exports = {
    DataWilayahRepository,
    UserRepository,
    TransactionHistoryRepository,
    DataAnggotaRepository,
    DataKeluargaRepository,
    DataLingkunganRepository
}