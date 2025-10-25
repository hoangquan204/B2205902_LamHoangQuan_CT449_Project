<script>
import axios from "axios";

export default {
  data() {
    return {
      tenDangNhap: "",
      password: "",
      showPassword: false, // ✅ Thêm biến để ẩn/hiện mật khẩu
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.loading = true;
      try {
        const response = await axios.post("/api/user/login", {
          TenDangNhap: this.tenDangNhap,
          Password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", "user");
        window.dispatchEvent(new Event("login-success"));
        this.$router.push("/");
      } catch (error) {
        this.errorMessage =
          "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.";
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
    style="min-height: 100vh; "
  >
    <v-card elevation="10" width="400" class="pa-6 rounded-xl">
      <v-card-title class="text-center text-h5 font-weight-bold mb-4">
        <v-icon color="primary" class="me-2">mdi-account-circle</v-icon>
        Đăng Nhập
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="tenDangNhap"
            label="Tên đăng nhập"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            required
          ></v-text-field>

          <!-- ✅ Mật khẩu có ẩn/hiện -->
          <v-text-field
            v-model="password"
            label="Mật khẩu"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            required
          ></v-text-field>

          <v-alert
            v-if="errorMessage"
            type="error"
            class="mt-2"
            border="start"
            elevation="2"
            dense
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn
            :loading="loading"
            type="submit"
            block
            color="primary"
            class="mt-4"
            size="large"
            elevation="3"
          >
            <v-icon start>mdi-login</v-icon>
            Đăng Nhập
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center mt-3">
        <v-btn
          variant="text"
          color="secondary"
          @click="$router.push('/register')"
        >
          <v-icon start>mdi-account</v-icon>
          Bạn chưa có tài khoản? Đăng ký tại đây
        </v-btn>
      </v-card-actions>

      <v-card-actions class="justify-center mt-3">
        <v-btn
          variant="text"
          color="danger"
          @click="$router.push('/staff/login')"
        >
          Đăng nhập với tài khoản quản trị
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
