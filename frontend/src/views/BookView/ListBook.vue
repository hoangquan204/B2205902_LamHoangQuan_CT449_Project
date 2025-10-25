<template>
  <v-container class="py-6">
    <h2 class="text-h5 font-weight-bold mb-4">Top 5 Sách Được Mượn Nhiều Nhất</h2>
    <v-card v-if="books.length" class="pa-4" elevation="4" rounded="xl">
      <v-row>
        <v-col
          v-for="(book, index) in books.slice().sort((a, b) => b.SoLuotMuon - a.SoLuotMuon).slice(0, 5)"
          :key="book._id"
          cols="12" sm="6" md="4" lg="2"
          class="text-center"
        >
          <div class="position-relative">
            <!-- Huy hiệu xếp hạng -->
            <v-badge
              :content="index + 1"
              color="red"
              class="ranking-badge"
              overlap
            >
            <router-link :to="`/book/detail/${book._id}`">
            <v-img
              :src="book.AnhBia || defaultImage"
              cover
              height="150"
              width="120"
              class="rounded-xl mb-2"
            ></v-img>
            </router-link>
            </v-badge>
          </div>

          <div class="text-subtitle-1 font-weight-bold">
            {{ book.TenSach }}
          </div>
          <div class="text-grey">
            {{ book.SoLuotMuon }} lượt mượn
          </div>
        </v-col>
      </v-row>
    </v-card>

    <TopBorrowedSlider :books="books" />

    <!-- Thanh tìm kiếm đẹp mắt -->
    <v-text-field
      v-model="searchQuery"
      label="Tìm kiếm theo tên sách..."
      placeholder="Nhập tên sách..."
      clearable
      outlined
      rounded
      dense
      hide-details
      class="mt-8 mb-6 search-field"
    >
      <template #prepend-inner>
        <v-icon color="primary">mdi-magnify</v-icon>
      </template>
      <template #append-inner>
        <v-icon
          v-if="searchQuery"
          class="cursor-pointer"
          color="grey"
          @click="searchQuery = ''"
        >
          mdi-close-circle
        </v-icon>
      </template>
    </v-text-field>

    <!-- Lưới sách -->
    <v-row dense>
      <v-col
        v-for="(book, index) in paginatedBooks"
        :key="book._id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="hover:scale-105 transition-transform duration-300" elevation="5" rounded="xl">
          <router-link :to="`/book/detail/${book._id}`">
          <v-img
            :src="book.AnhBia || defaultImage"
            height="220"
            cover
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary" />
              </v-row>
            </template>
          </v-img>
          </router-link>

          <v-card-title class="text-h6 text-center">{{ book.TenSach }}</v-card-title>

          <v-card-subtitle class="text-center text-grey">
            <v-icon icon="mdi-account" size="small" class="mr-1" />
            {{ book.TacGia }}
          </v-card-subtitle>

          <v-divider class="my-2" />

          <v-card-text class="text-body-2">
            <div><strong>Nhà XB:</strong> {{ book.MaNXB?.TenNXB || 'Không xác định' }}</div>
            <div><strong>Năm XB:</strong> {{ book.NamXuatBan }}</div>
            <div><strong>Số quyển:</strong> {{ book.SoQuyen }}</div>
            <div class="text-primary mt-2 text-h6">{{ book.SoLuotMuon +" lượt mượn" }}</div>
          </v-card-text>

          <v-btn color="primary" block class="mt-4" @click="handleBorrow(book._id)">
  <v-icon start>mdi-book-check</v-icon> Mượn sách
</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Thông báo nếu không có sách -->
    <v-alert
      v-if="filteredBooks.length === 0"
      type="info"
      class="mt-6 text-center"
    >
      Không tìm thấy sách nào!
    </v-alert>

    <v-pagination
  v-model="currentPage"
  :length="totalPages"
  class="mt-6"
  prev-icon="mdi-chevron-left"
  next-icon="mdi-chevron-right"
/>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      books: [],
      searchQuery: "",
      defaultImage: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
      currentPage: 1,
itemsPerPage: 8,
    };
  },
  watch: {
  searchQuery() {
    this.currentPage = 1;
  }
},

  async created() {
    await this.fetchBooks();
  },
  computed: {
    filteredBooks() {
      if (!this.searchQuery.trim()) {
        return this.books;
      }
      return this.books.filter((book) =>
        book.TenSach.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
     paginatedBooks() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredBooks.slice(start, start + this.itemsPerPage);
},
totalPages() {
  return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
},
  },
  methods: {
    formatCurrency(value) {
      if (!value) return "—";
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    async fetchBooks() {
      try {
        const response = await axios.get("/api/books");
        this.books = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },
    async deleteBook(bookId) {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Chỉ có nhân viên mới được sử dụng chức năng này!");
        return;
      }

      if (!confirm("Bạn có chắc chắn muốn xóa sách này?")) return;

      try {
        await axios.delete(`/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.books = this.books.filter((book) => book._id !== bookId);
        alert("Xóa sách thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        alert("Xóa sách thất bại!");
      }
    },
    handleBorrow(bookId) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn cần đăng nhập để mượn sách!");
      this.$router.push("/login");
      return;
    }

    this.$router.push(`/book/borrow/${bookId}`);
  },
 
  },
};
</script>

<style scoped>
.v-card {
  transition: transform 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

/* Thanh tìm kiếm đẹp */
.search-field .v-input__control {
  background-color: #f5f5f5; /* nền nhạt */
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.search-field .v-input__control:hover {
  background-color: #ffffff; /* hover sáng hơn */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
