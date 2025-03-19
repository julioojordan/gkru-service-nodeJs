class DataKeluargaService {
    constructor(repository, db) {
        this.repository = repository;
        this.db = db;
    }

    async findOne(idKeluarga) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findOne(idKeluarga, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllWith() {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findAllWith(connection);
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

    async getTotalWithFilter() {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.getTotalWithFilter(connection);
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

module.exports = DataKeluargaService;
