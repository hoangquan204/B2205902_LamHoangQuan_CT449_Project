<script>
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import ChatBot from "./views/ChatBot/ChatBot.vue";

export default {
  components: {
    Header,
    ChatBot,
    Footer
  },
};
</script>

<template>
  <!-- Bọc toàn bộ nội dung trong <v-app> -->
  <v-app>
    <Header />

    <!-- Khu vực chính -->
    <v-main>
      <router-view />
    </v-main>
        <ChatBot />
    <Footer />
  </v-app>
</template>

<style>
/* Nếu muốn thêm nền, bạn có thể bọc trong v-main hoặc dùng v-container */
/* .v-main {
  background-image: url('https://cdn.pixabay.com/photo/2016/11/29/07/22/bible-1868070_1280.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  min-height: 100vh;
} */
</style>
