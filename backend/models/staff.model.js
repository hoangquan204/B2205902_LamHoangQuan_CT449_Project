const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nhanVienSchema = mongoose.Schema({
    MSNV: { type: String, unique: true, required: true },
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String, required: true },
    DiaChi: { type: String, required: true },
    SoDienThoai: { type: String, required: true }
});

nhanVienSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

const NHANVIEN = mongoose.model('NHANVIEN', nhanVienSchema);

module.exports = NHANVIEN;