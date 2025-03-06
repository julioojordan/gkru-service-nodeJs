class DataWilayahService {
    constructor(repository, db) {
        this.repository = repository;
        this.db = db;
    }

    async findOne(id) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findOne(id, connection);
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

    async add(req) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.add(req.body, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async update(req) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.update(req.params.idWilayah , req.body, connection);
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

    async getTotalWilayah() {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.getTotalWilayah(connection);
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

module.exports = DataWilayahService;
