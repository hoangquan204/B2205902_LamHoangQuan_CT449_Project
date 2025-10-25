const TheoDoiMuonSach = require('../models/borrowing.model');
const NguoiDung = require('../models/user.model');
const Sach = require('../models/book.model'); // Import model sách
const SACH = require('../models/book.model');

exports.getAllBorrow = async (req, res) => {
    try {
        const borrow = await TheoDoiMuonSach.find().populate('MaNguoiDung').populate('MaSach');
        const borrowResult = await TheoDoiMuonSach.find({
        TrangThai: { $in: ['Đã duyệt'] }
        })
        .populate('MaNguoiDung')
        .populate('MaSach');
        for (const item of borrowResult) {
                const bookId = item.MaSach._id;
                const book = await SACH.findById(bookId);
                book.SoLuotMuon += 1;
                await book.save();       // Trạng thái mượn
        }

        res.status(200).json(borrow);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách mượn', error });
    }
};

exports.borrowRequest = async (req, res) => {
    try {
        const { MaSach } = req.body;

        // Lấy MaNguoiDung từ token (giả sử middleware auth đã gắn user vào req.user)
        const MaNguoiDung = req.staff.id;

        if (!MaNguoiDung) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc người dùng chưa đăng nhập!' });
        }

       // Kiểm tra xem người dùng đã mượn sách này chưa và chưa trả
        const existingRequest = await TheoDoiMuonSach.findOne({ 
            MaNguoiDung, 
            MaSach, 
            TrangThai: { $in: ['Đang chờ duyệt', 'Đang mượn'] } // Chặn nếu đang chờ duyệt hoặc đang mượn
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Bạn đang mượn hoặc đã gửi yêu cầu mượn sách này. Vui lòng hoàn tất trước khi mượn lại!' });
        }


        // Kiểm tra xem sách có tồn tại không
        const book = await Sach.findById(MaSach);
        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách!' });
        }

        // Kiểm tra số lượng sách còn không
        if (book.SoQuyen <= 0) {
            return res.status(400).json({ message: 'Sách đã hết, không thể mượn!' });
        }

        // Giảm số lượng sách khi gửi yêu cầu mượn
        book.SoQuyen -= 1;
        await book.save();


        // Tạo yêu cầu mượn sách mới
        const newRequest = new TheoDoiMuonSach({ 
            MaNguoiDung, 
            MaSach,
            TrangThai: 'Đang chờ duyệt'
        });

        await newRequest.save();

        res.json({ message: 'Gửi yêu cầu mượn sách thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.approveBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const borrowRequest = await TheoDoiMuonSach.findById(id);
        if (!borrowRequest) {
            return res.status(404).json({ message: 'Không tìm thấy đơn mượn!' });
        }

        // Cập nhật ngày mượn
        borrowRequest.NgayMuon = new Date();
        const ngayTra = new Date();
        ngayTra.setMonth(ngayTra.getMonth() + 1);
        borrowRequest.NgayTra = ngayTra;
        borrowRequest.SoLuotMuon += 1;
        borrowRequest.TrangThai = 'Đã duyệt';
        await borrowRequest.save();

        res.json({ message: 'Duyệt đơn mượn sách thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.rejectBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const borrowRequest = await TheoDoiMuonSach.findById(id);
        if (!borrowRequest) {
            return res.status(404).json({ message: 'Không tìm thấy đơn mượn!' });
        }

        const bookId = borrowRequest.MaSach;

        borrowRequest.TrangThai = 'Đã từ chối';
        await borrowRequest.save();

        // Cộng lại số sách nếu đơn bị từ chối
        const book = await Sach.findById(bookId);
        if (book) {
            book.SoQuyen += 1;
            await book.save();
        }

        res.json({ message: 'Từ chối đơn mượn sách thành công, số lượng sách được phục hồi và xóa độc giả nếu không có đơn khác!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm đơn mượn và populate thông tin độc giả
        const borrowRequest = await TheoDoiMuonSach.findById(id);
        if (!borrowRequest) {
            return res.status(404).json({ message: 'Không tìm thấy đơn mượn!' });
        }

        // Cập nhật ngày trả sách
        borrowRequest.NgayTra = new Date();
        await borrowRequest.save();

        // Cập nhật số lượng sách trong kho
        const book = await Sach.findById(borrowRequest.MaSach);
        if (book) {
            book.SoQuyen += 1;
            await book.save();
        }

        borrowRequest.TrangThai = 'Đã trả';
        await borrowRequest.save();

        res.json({ message: 'Trả sách thành công!' });
    } catch (error) {
        console.error('Lỗi khi trả sách:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.getMyBorrowedBooks = async (req, res) => {
    try {
        // Lấy user id từ token (giả sử middleware verifyToken đã gắn req.user)
        const MaNguoiDung = req.staff?.id;
        if (!MaNguoiDung) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc người dùng chưa đăng nhập!' });
        }

        // Lấy danh sách mượn của người dùng và populate thông tin sách
        const borrowedBooks = await TheoDoiMuonSach.find({ MaNguoiDung })
            .populate('MaSach')
            .sort({ NgayMuon: -1 }); // sắp xếp theo ngày mượn gần nhất

        res.status(200).json(borrowedBooks);
    } catch (error) {
        console.error('Lỗi khi lấy sách đã mượn:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};
