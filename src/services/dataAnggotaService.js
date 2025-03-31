class DataAnggotaService {
    constructor(repository, db) {
        this.repository = repository;
        this.db = db;
    }

    async findOne(idAnggota) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findOne(idAnggota, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllWithIdKeluarga(params) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAllWithIdKeluarga(params, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAll(params) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAll(params, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async add(data) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.add(data, connection);
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

    async getTotal() {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.getTotal(connection);
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

module.exports = DataAnggotaService;
