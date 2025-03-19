const path = require("path");
const fs = require("fs");
const util = require("util");


const saveFile = async(file) => {
    try {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, file.originalname);
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(filePath, file.buffer);

      return `/uploads/${encodeURIComponent(file.originalname)}`;
    } catch (error) {
      throw createHttpError(500, "Gagal menyimpan file");
    }
  }


module.exports = saveFile