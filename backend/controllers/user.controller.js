const NGUOIDUNG = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Lấy danh sách người dùng
exports.getAllUser = async (req, res) => {
    try {
        const userList = await NGUOIDUNG.find();
        // Kiểm tra người dùng đang đăng nhập (từ middleware verifyToken)
        const currentUser = req.user ? await NGUOIDUNG.findById(req.user.id) : null;

        res.json({ userList, currentUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng!', error: error.message });
    }
};

//  Lấy người dùng theo id
exports.getUser = async (req, res) => {
    try {
        const userId = req.staff?.id;
        const user = await NGUOIDUNG.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy người dùng', error });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await NGUOIDUNG.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy người dùng', error });
    }
};


// Thêm người dùng mới
// Thêm người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { TenDangNhap, HoTen, Password, DiaChi, SoDienThoai } = req.body;

    if (!TenDangNhap || !Password || !HoTen || !DiaChi || !SoDienThoai) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // 🔍 Kiểm tra trùng tên đăng nhập
    const existingUser = await NGUOIDUNG.findOne({ TenDangNhap });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác' });
    }

    // ✅ Tạo mới người dùng
    const newUser = new NGUOIDUNG({ TenDangNhap, HoTen, Password, DiaChi, SoDienThoai });
    await newUser.save();

    res.status(201).json({
      message: 'Thêm người dùng mới thành công',
      user: newUser
    });
  } catch (error) {
    console.error('❌ Lỗi khi thêm người dùng:', error); // <— in chi tiết lỗi ra console
    res.status(500).json({ message: 'Lỗi khi thêm người dùng', error: error.message });
  }
};



// Cập nhật đọc giả
exports.updateUser = async (req, res) => {
    try {
        const id = req.staff?.id;
        let updateData = req.body;

        if (updateData.Password) {
            const salt = await bcrypt.genSalt(10);
            updateData.Password = await bcrypt.hash(updateData.Password, salt);
        }

        const updatedUser = await NGUOIDUNG.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy đọc giả' });
        res.status(200).json({ message: 'Cập nhật đọc giả thành công', staff: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đọc giả', error });
    }
};


// Xóa đọc giả
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await NGUOIDUNG.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'Không tìm thấy đọc giả' });
        res.status(200).json({ message: 'Xóa đọc giả thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đọc giả', error });
    }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  const { TenDangNhap, Password } = req.body;

  try {
    // Tìm người dùng theo tên đăng nhập
    const user = await NGUOIDUNG.findOne({ TenDangNhap });
    if (!user) {
      return res.status(404).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    const isBlock = user.TrangThai === 'Inactive';
    if (isBlock) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, TenDangNhap: user.TenDangNhap, vaiTro: "user" },
      process.env.SECRET_KEY || 'mysecretkey',
      { expiresIn: '3h' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        TenDangNhap: user.TenDangNhap,
        HoTen: user.HoTen,
        DiaChi: user.DiaChi,
        SoDienThoai: user.SoDienThoai
      }
    });
  } catch (error) {
    console.error('❌ Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};


