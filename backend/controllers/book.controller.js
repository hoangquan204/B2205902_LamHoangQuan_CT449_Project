const SACH = require('../models/book.model');

// Lấy danh sách sách
exports.getAllBooks = async (req, res) => {
    try {
        const books = await SACH.find().populate('MaNXB');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sách', error });
    }
};

// Lấy sách theo id
exports.getBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await SACH.findById(id).populate('MaNXB');
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sách', error });
    }
};

// Thêm sách mới
exports.createBook = async (req, res) => {
    try {
        const { TenSach, DonGia, SoQuyen, NamXuatBan,AnhBia, MaNXB, TacGia } = req.body;
        const newBook = new SACH({ TenSach, DonGia, SoQuyen, NamXuatBan,AnhBia, MaNXB, TacGia });
        await newBook.save();
        res.status(201).json({ message: 'Thêm sách thành công', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sách', error });
    }
};

// Cập nhật sách
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await SACH.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(200).json({ message: 'Cập nhật sách thành công', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sách', error });
    }
};

// Xóa sách
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await SACH.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(200).json({ message: 'Xóa sách thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sách', error });
    }
};