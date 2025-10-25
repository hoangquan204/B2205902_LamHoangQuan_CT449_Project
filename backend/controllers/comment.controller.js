const BINHLUAN = require('../models/comment.model');

exports.getAllCommentByMaSach = async (req, res) => {
    try {
        const MaSach = req.params.id;
        const comments = await BINHLUAN.find({ MaSach: MaSach }).populate('MaNguoiDung', 'HoTen TenDangNhap Avatar').sort({ NgayBinhLuan: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà xuất bản', error });
    }
};

exports.createComment = async (req, res) => {
    try {
        const MaNguoiDung = req.staff.id;  // Lấy ID người dùng từ token
        const MaSach = req.params.id;       // ✅ Đúng rồi!
        const { NoiDung, DanhGia } = req.body;

        const newComment = new BINHLUAN({
            MaNguoiDung,
            MaSach,
            NoiDung,
            DanhGia,
            NgayBinhLuan: new Date()
        });

        await newComment.save();
        res.status(201).json({ message: 'Gửi bình luận thành công', comment: newComment });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi gửi bình luận', error });
    }
};
