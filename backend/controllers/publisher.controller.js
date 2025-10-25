const NHAXUATBAN = require('../models/publisher.model');

exports.getAllPublisher = async (req, res) => {
    try {
        const publishers = await NHAXUATBAN.find();
        res.status(200).json(publishers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà xuất bản', error });
    }
};

// Thêm sách mới
exports.createPublisher = async (req, res) => {
    try {
        const { TenNXB,DiaChi } = req.body;
        const newPublisher = new NHAXUATBAN({ TenNXB,DiaChi  });
        await newPublisher.save();
        res.status(201).json({ message: 'Thêm xuất bản thành công', publisher: newPublisher });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm nhà xuất bản', error });
    }
};