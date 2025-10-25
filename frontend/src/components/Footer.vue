<template>
  <v-footer padless class="bg-grey-darken-4 text-white">
    <v-container class="py-6">
      <v-row>
        <!-- Cột 1: Thông tin website -->
        <v-col cols="12" md="4" class="text-center text-md-start">
          <h4 class="font-weight-bold">Thư Viện Sách Online</h4>
          <p class="text-grey lighten-1">
            Nền tảng mượn và đọc sách trực tuyến cho sinh viên.
          </p>
        </v-col>

        <!-- Cột 2: Liên hệ -->
        <v-col cols="12" md="4" class="text-center">
          <p><v-icon size="18">mdi-map-marker</v-icon> Cần Thơ, Việt Nam</p>
          <p><v-icon size="18">mdi-phone</v-icon> 0123 456 789</p>
          <p><v-icon size="18">mdi-email</v-icon> admin@library.com</p>
        </v-col>

        <!-- Cột 3: Mạng xã hội -->
        <v-col cols="12" md="4" class="text-center text-md-end">
          <v-btn icon variant="text" href="https://facebook.com" target="_blank">
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon variant="text" href="https://instagram.com" target="_blank">
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <v-btn icon variant="text" href="https://github.com" target="_blank">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Dòng bản quyền -->
      <v-divider class="my-4"></v-divider>
      <p class="text-center mb-0">
        © {{ new Date().getFullYear() }} Thư Viện Sách Online - Mọi quyền được bảo lưu
      </p>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
p {
  margin: 4px 0;
}
</style>
