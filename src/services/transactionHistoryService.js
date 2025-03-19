class TransactionHistoryService {
    constructor(repository, db) {
        this.repository = repository;
        this.db = db;
    }

    async add(body) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.add(body, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async addBatch(body) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.addBatch(body,connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getTotalIncome(query) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.getTotalIncome(query, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getTotalOutcome() {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.getTotalOutcome(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAll() {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAll(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findByGroup(idGroup) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findByGroup(idGroup, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllWithKeluargaContext(tahun) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAllWithKeluargaContext(tahun, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllHistoryWithTimeFilter(query) {
        const {tahun, bulan, idLingkungan, idWilayah,} = query
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAllHistoryWithTimeFilter(tahun, bulan, idLingkungan, idWilayah, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllSetoran(query) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAllSetoran(query, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findOne(idTh) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findOne(idTh, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllWithIdKeluarga(query) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAllWithIdKeluarga(query.idKeluarga, query.tahun, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async update(id, data) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.update(id, data, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deleteOne(id) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.deleteOne(id, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = TransactionHistoryService