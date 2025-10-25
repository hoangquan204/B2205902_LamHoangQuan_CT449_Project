<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        TenDangNhap: "",
        HoTen: "",
        Password: "",
        DiaChi: "",
        SoDienThoai: "",
      },
      confirmPassword: "",  // Thêm xác nhận mật khẩu
      loading: false,
      errorMessage: "",
      successMessage: "",
      showPassword: false,
      rules: {
        required: (v) => !!v || "Trường này là bắt buộc",
        min: (v) => (v && v.length >= 6) || "Mật khẩu phải có ít nhất 6 ký tự",
        phone: (v) =>
          /^0\d{9}$/.test(v) || "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)",
      },
    };
  },
  methods: {
    async register() {
      this.errorMessage = "";
      this.successMessage = "";
      this.loading = true;

      // Kiểm tra các trường bắt buộc
      if (
        !this.user.TenDangNhap ||
        !this.user.HoTen ||
        !this.user.Password ||
        !this.user.DiaChi ||
        !this.user.SoDienThoai
      ) {
        this.errorMessage = "Vui lòng điền đầy đủ tất cả thông tin!";
        this.loading = false;
        return;
      }

      // Kiểm tra mật khẩu nhập lại
      if (this.user.Password !== this.confirmPassword) {
        this.errorMessage = "Mật khẩu nhập lại không khớp!";
        this.loading = false;
        return;
      }

      try {
        const response = await axios.post("/api/user", this.user);

        this.successMessage = "Đăng ký thành công! Bạn có thể đăng nhập ngay.";
        this.user = {
          TenDangNhap: "",
          HoTen: "",
          Password: "",
          DiaChi: "",
          SoDienThoai: "",
        };
        this.confirmPassword = "";

        // Chuyển đến trang đăng nhập
        this.$router.push("/login");
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          "Đăng ký thất bại! Vui lòng thử lại.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <v-container
    fluid
    class="d-flex align-center justify-center"
    style="min-height: 100vh"
  >
    <v-card elevation="10" width="500" class="pa-6 rounded-xl">
      <v-card-title class="text-center text-h5 font-weight-bold mb-4">
        <v-icon color="primary" class="me-2">mdi-account-plus</v-icon>
        Đăng Ký Tài Khoản
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="user.TenDangNhap"
            label="Tên đăng nhập"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.HoTen"
            label="Họ và tên"
            prepend-inner-icon="mdi-card-account-details"
            variant="outlined"
            color="primary"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.Password"
            label="Mật khẩu"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            :rules="[rules.required, rules.min]"
            required
          ></v-text-field>

          <!-- Thêm Nhập lại mật khẩu -->
          <v-text-field
            v-model="confirmPassword"
            label="Nhập lại mật khẩu"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.DiaChi"
            label="Địa chỉ"
            prepend-inner-icon="mdi-home"
            variant="outlined"
            color="primary"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.SoDienThoai"
            label="Số điện thoại"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            color="primary"
            :rules="[rules.required, rules.phone]"
            required
          ></v-text-field>

          <!-- Thông báo lỗi -->
          <v-alert
            v-if="errorMessage"
            type="error"
            border="start"
            elevation="2"
            class="mt-3"
            dense
          >
            {{ errorMessage }}
          </v-alert>

          <!-- Thông báo thành công -->
          <v-alert
            v-if="successMessage"
            type="success"
            border="start"
            elevation="2"
            class="mt-3"
            dense
          >
            {{ successMessage }}
          </v-alert>

          <!-- Nút đăng ký -->
          <v-btn
            :loading="loading"
            type="submit"
            block
            color="primary"
            class="mt-4"
            size="large"
            elevation="3"
          >
            <v-icon start>mdi-account-plus</v-icon>
            Đăng Ký
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center mt-3">
        <v-btn variant="text" color="secondary" @click="$router.push('/login')">
          <v-icon start>mdi-login</v-icon>
          Đã có tài khoản? Đăng nhập
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card {
  background: linear-gradient(135deg, #f9fafb, #ffffff);
}
</style>
