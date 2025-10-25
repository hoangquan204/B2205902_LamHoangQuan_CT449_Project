<script>
import axios from "axios";

export default {
  data() {
    return {
      maSo: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.loading = true;
      try {
        const response = await axios.post("/api/staff/login", {
          MSNV: this.maSo,
          Password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", "staff");
        console.log("Login successful:", response.data.user);
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
        Đăng Nhập Nhân Viên
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="maSo"
            label="Mã nhân viên (VD: NV123)"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Mật khẩu"
            prepend-inner-icon="mdi-lock"
            type="password"
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
        <v-btn variant="text" color="secondary" @click="$router.push('/')">
          <v-icon start>mdi-arrow-left</v-icon>
          Quay lại Trang chủ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
