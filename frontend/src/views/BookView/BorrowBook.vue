<script>
import axios from "axios";

export default {
  name: "BorrowBook",
  data() {
    const today = new Date();
    return {
      borrowData: {
        MaSach: this.$route.params.id, // lấy từ route
      },
      book: {},
      message: "",
      loading: false,
      snackbar: false,
      snackbarColor: "success",
      ngayMuon: today.toISOString().slice(0, 10), // YYYY-MM-DD
      ngayTra: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
        .toISOString()
        .slice(0, 10),
      baoQuanChecked: false, // checkbox bắt buộc
    };
  },
  async created() {
    await this.fetchBookDetails();
  },
  methods: {
    async fetchBookDetails() {
      try {
        const response = await axios.get(`/api/books/${this.borrowData.MaSach}`);
        this.book = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách:", error);
        this.book = { TenSach: "Không tìm thấy sách" };
      }
    },

    async submitBorrowRequest() {
      if (!this.baoQuanChecked) {
        this.message = "Bạn phải cam kết bảo quản sách trước khi gửi!";
        this.snackbarColor = "error";
        this.snackbar = true;
        return;
      }

      try {
        this.loading = true;
        console.log(this.borrowData)
        const response = await axios.post("/api/borrow", this.borrowData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.message = response.data.message;
        this.snackbarColor = "success";
        this.snackbar = true;
        setTimeout(() => this.$router.push("/"), 1200);
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu mượn sách:", error);
        this.message = error.response?.data?.message || "Lỗi không xác định!";
        this.snackbarColor = "error";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h2 class="text-center mb-8 text-primary font-weight-bold">
          Đăng ký mượn sách
        </h2>

        <!-- Card hiển thị thông tin sách -->
        <v-card class="book-card mb-8" elevation="10" rounded="xl">
          <v-row no-gutters>
            <v-col cols="12" sm="5" class="d-flex justify-center align-center pa-4">
              <v-img
                :src="book.AnhBia || 'https://cdn-icons-png.flaticon.com/512/29/29302.png'"
                max-width="180"
                max-height="260"
                class="book-cover rounded-lg"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="7" class="book-info pa-4">
              <v-card-title class="text-h6 font-weight-bold mb-2">
                {{ book.TenSach || "Không tìm thấy sách" }}
              </v-card-title>
              <v-divider class="mb-3"></v-divider>
              <v-card-text class="text-body-2">
                <p><strong>Tác giả:</strong> {{ book.TacGia || "Chưa rõ" }}</p>
                <p><strong>Nhà xuất bản:</strong> {{ book.MaNXB?.TenNXB || "N/A" }}</p>
                <p><strong>Năm XB:</strong> {{ book.NamXuatBan || "N/A" }}</p>
                <p><strong>Số quyển còn lại:</strong> {{ book.SoQuyen || "Không rõ" }}</p>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Form đăng ký mượn -->
        <v-form @submit.prevent="submitBorrowRequest" class="pa-4 elevation-3 rounded-xl bg-white">
          <p>Thời gian mượn sách tối đa 30 ngày kể từ ngày được phê duyệt, đọc giả đến trực tiếp thư viện để nhận sách sau khi đã được phê duyệt.</p>
          <v-checkbox
            v-model="baoQuanChecked"
          label="Tôi cam kết sẽ bảo quản sách trong thời gian mượn sách, nếu có hư hại tôi hoàn toàn chịu trách nhiệm"
            color="primary"
            required
          ></v-checkbox>

          <v-btn
            color="primary"
            type="submit"
            block
            class="mt-4"
            :loading="loading"
            size="large"
            elevation="4"
          >
            Gửi yêu cầu mượn sách
          </v-btn>
        </v-form>

        <!-- Snackbar -->
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          timeout="3000"
          location="bottom"
        >
          {{ message }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>
