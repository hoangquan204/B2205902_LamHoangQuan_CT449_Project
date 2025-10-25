<template>
  <v-container class="py-10">
    <v-row >
      <v-col cols="12" md="4" lg="6">
        <!-- Loader khi tải thông tin người dùng -->
        <v-row v-if="loadingUser" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <!-- Thông tin cá nhân -->
        <v-card v-else-if="user" elevation="10" rounded="xl" class="pa-6 profile-card">
          <v-row justify="center">
            <v-avatar size="120">
              <v-img src="https://cdn-icons-png.flaticon.com/512/149/149071.png"></v-img>
            </v-avatar>
          </v-row>

          <v-row justify="center" class="mt-4">
            <v-col cols="12" class="text-center">
              <h2 class="font-weight-bold text-primary">{{ user.HoTen }}</h2>
              <p class="text-subtitle-1 text-grey">{{ user.TenDangNhap }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12" sm="6" class="mb-3">
              <v-card outlined rounded="lg" class="pa-4 info-card">
                <p class="font-weight-medium mb-2">Địa chỉ</p>
                <p>{{ user.DiaChi || "Chưa cập nhật" }}</p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" class="mb-3">
              <v-card outlined rounded="lg" class="pa-4 info-card">
                <p class="font-weight-medium mb-2">Số điện thoại</p>
                <p>{{ user.SoDienThoai || "Chưa cập nhật" }}</p>
              </v-card>
            </v-col>
          </v-row>

          <!-- Nút chỉnh sửa -->
          <v-btn color="primary" block @click="openEditDialog" class="mt-4">
            <v-icon start>mdi-pencil</v-icon> Chỉnh sửa thông tin
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" lg="6" class="scroll-y-box">

        <!-- Danh sách sách đã mượn -->
        <v-card v-if="user" elevation="8" rounded="xl" class="pa-6">
          <h3 class="text-h6 font-weight-bold text-primary mb-4">Sách đã mượn</h3>
          <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="Lọc theo trạng thái"
                dense
                clearable
                style="max-width: 250px"
                variant="outlined"
              ></v-select>
          <v-divider class="mb-4"></v-divider>

          <v-row v-if="loadingBooks" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>

          <v-row v-else>
           <v-col v-for="borrow in filteredBorrows" :key="borrow._id" cols="12" class="mb-4"  >

              <v-card outlined rounded="lg" class="pa-4 borrow-card">
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex align-center">
                    <v-img
                      :src="borrow.MaSach?.AnhBia || 'https://cdn-icons-png.flaticon.com/512/29/29302.png'"
                      height="100"
                      contain
                      class="rounded"
                    ></v-img>
                  </v-col>
                  <v-col cols="8" class="pl-4">
                    <h4 class="font-weight-medium mb-1">{{ borrow.MaSach?.TenSach }}</h4>
                    <p class="mb-1"><strong>Tác giả:</strong> {{ borrow.MaSach?.TacGia || "Chưa rõ" }}</p>
                    <p class="mb-1"><strong>Ngày mượn:</strong> {{ borrow?.NgayMuon ? new Date(borrow.NgayMuon).toLocaleDateString("vi-VN") : "" }}</p>
                    <p class="mb-2"><strong>Ngày trả dự kiến:</strong> {{ borrow?.NgayTra ? new Date(borrow.NgayTra).toLocaleDateString("vi-VN") : "" }}</p>
                    <v-chip
                      :color="borrow.TrangThai === 'Đang chờ duyệt' ? 'orange' : borrow.TrangThai === 'Đã trả' ? 'green' : 'blue'"
                      small
                      dark
                    >
                      {{ borrow.TrangThai }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal chỉnh sửa thông tin -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card class="pa-6 rounded-xl">
        <v-card-title class="text-h6 font-weight-bold mb-4">
          <v-icon color="primary" class="me-2">mdi-pencil</v-icon>
          Chỉnh sửa thông tin cá nhân
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editData.HoTen" label="Họ và tên" required></v-text-field>

            <v-text-field
              v-model="editData.Password"
              label="Mật khẩu mới (bỏ trống nếu không đổi)"
              type="password"
            ></v-text-field>

            <v-text-field
              v-model="editData.ConfirmPassword"
              label="Nhập lại mật khẩu mới"
              type="password"
            ></v-text-field>

            <v-text-field v-model="editData.DiaChi" label="Địa chỉ" required></v-text-field>
            <v-text-field v-model="editData.SoDienThoai" label="Số điện thoại" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text color="grey" @click="editDialog = false">Hủy</v-btn>
          <v-btn :loading="saving" color="primary" @click="updateUser">
            <v-icon start>mdi-content-save</v-icon> Lưu thay đổi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: null,
      borrowedBooks: [],
      selectedStatus: null,
      statusOptions: ["Đang chờ duyệt", "Đã duyệt", "Đã từ chối", "Đã trả"],
      loadingUser: false,
      loadingBooks: false,
      editDialog: false,
      editData: {
        HoTen: "",
        Password: "",
        ConfirmPassword: "",
        DiaChi: "",
        SoDienThoai: "",
      },
      saving: false,
    };
  },

  async created() {
    await this.fetchUserProfile();
    await this.fetchBorrowedBooks();
  },
 computed: {
    filteredBorrows() {
      if (!this.selectedStatus) return this.borrowedBooks;
      return this.borrowedBooks.filter((b) => b.TrangThai === this.selectedStatus);
    },
  },
  methods: {
    async fetchUserProfile() {
      try {
        this.loadingUser = true;
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.user = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        this.user = null;
      } finally {
        this.loadingUser = false;
      }
    },

    async fetchBorrowedBooks() {
      try {
        this.loadingBooks = true;
        const response = await axios.get("/api/borrow/my", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.borrowedBooks = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mượn:", error);
        this.borrowedBooks = [];
      } finally {
        this.loadingBooks = false;
      }
    },

    openEditDialog() {
      this.editData = {
        HoTen: this.user.HoTen,
        Password: "",
        ConfirmPassword: "",
        DiaChi: this.user.DiaChi,
        SoDienThoai: this.user.SoDienThoai,
      };
      this.editDialog = true;
    },

    validateForm() {
      if (!this.editData.HoTen.trim()) {
        alert("Họ tên không được để trống!");
        return false;
      }

      if (this.editData.Password) {
        if (this.editData.Password.length < 6) {
          alert("Mật khẩu phải có ít nhất 6 ký tự!");
          return false;
        }
        if (this.editData.Password !== this.editData.ConfirmPassword) {
          alert("Mật khẩu mới và nhập lại mật khẩu không khớp!");
          return false;
        }
      }

      if (!this.editData.DiaChi.trim()) {
        alert("Vui lòng nhập địa chỉ!");
        return false;
      }

      const phoneRegex = /^[0-9]{9,11}$/;
      if (!phoneRegex.test(this.editData.SoDienThoai)) {
        alert("Số điện thoại không hợp lệ!");
        return false;
      }

      return true;
    },

    async updateUser() {
      if (!this.validateForm()) return;

      const payload = { ...this.editData };
      delete payload.ConfirmPassword; // Không gửi ConfirmPassword lên backend

      try {
        this.saving = true;
        await axios.put("/api/user", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.editDialog = false;
        await this.fetchUserProfile();
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        alert("Cập nhật thất bại. Vui lòng thử lại!");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.profile-card {
  background: linear-gradient(135deg, #f3f4f6, #ffffff);
  text-align: center;
}
.info-card {
  background-color: #fafafa;
  border-left: 4px solid #1976d2;
}
.borrow-card {
  background-color: #fefefe;
  border-left: 4px solid #1976d2;
}
.scroll-y-box {
  max-height: 90vh;   /* Vùng sách mượn cao tối đa 80% màn hình */
  overflow-y: auto;   /* Tạo cuộn dọc khi nội dung dài */
  padding-right: 8px; /* Tránh đè lên thanh cuộn */
}

</style>
