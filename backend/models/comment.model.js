const mongoose = require('mongoose');

const binhLuanSchema = new mongoose.Schema({
     MaNguoiDung: {
        type: mongoose.Types.ObjectId,
        ref: 'NGUOIDUNG',
        required: true
    },
     MaSach: {
        type: mongoose.Types.ObjectId,
        ref: 'SACH',
        required: true
    },
    NoiDung: { type: String, required: true },
    NgayBinhLuan: { type: Date, default: Date.now },
    DanhGia: { type: Number, required: true, min: 1, max: 5 }
});

const BINHLUAN = mongoose.model('BINHLUAN', binhLuanSchema);

module.exports = BINHLUAN;