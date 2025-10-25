const mongoose = require('mongoose');

const muonSachSchema = mongoose.Schema({
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
    NgayMuon: { type: Date, default: null },
    NgayTra: { type: Date, default: null },
    TrangThai: {type: String, enum: ['Đang chờ duyệt', 'Đã duyệt', 'Đã từ chối', 'Đã trả'], default: 'Đang chờ duyệt' }
})

const THEODOIMUONSACH = mongoose.model('THEODOIMUONSACH', muonSachSchema);

module.exports = THEODOIMUONSACH;