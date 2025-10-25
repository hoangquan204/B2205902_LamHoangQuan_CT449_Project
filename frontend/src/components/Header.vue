<template>
  <v-app-bar class="v-app-bar" app color="indigo-darken-3" dark>
    <!-- Logo / Tên website bên trái -->
    <v-app-bar-title class="d-flex align-center">
      <RouterLink to="/" class="text-white text-decoration-none d-flex align-center">
        <span class="ms-2 font-weight-bold">BookStore</span>
      </RouterLink>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Nếu đã đăng nhập -->
    <template v-if="isLoggedIn">
      <v-menu location="bottom end" transition="scale-transition">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list density="compact" width="220">
          <v-list-item
            v-if="role === 'user'"
            title="Trang cá nhân"
            prepend-icon="mdi-account"
            @click="goToProfile"
          />
          <v-list-item
            v-else-if="role === 'staff'"
            title="Trang quản trị"
            prepend-icon="mdi-cog"
            @click="goToAdmin"
          />
          <v-divider></v-divider>
          <v-list-item
            title="Đăng xuất"
            prepend-icon="mdi-logout"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </template>

    <!-- Nếu chưa đăng nhập -->
    <template v-else>
      <v-btn
        color="white"
        variant="outlined"
        class="me-4"
        @click="goToLogin"
      >
        <v-icon start>mdi-login</v-icon>
        Đăng nhập
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  name: "HeaderBar",
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token"),
      role: localStorage.getItem("role") || null,
      userAvatar: null,
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
  },
  mounted() {
    window.addEventListener("storage", this.checkLoginStatus);
    window.addEventListener("login-success", this.checkLoginStatus);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.checkLoginStatus);
    window.removeEventListener("login-success", this.checkLoginStatus);
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("token");
      this.role = localStorage.getItem("role") || null;
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    goToAdmin() {
      this.$router.push("/staff/dashboard");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.role = null;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
.v-app-bar-title span {
  font-size: 1.25rem;
}
.v-avatar {
  cursor: pointer;
  border: 2px solid white;
}
</style>
