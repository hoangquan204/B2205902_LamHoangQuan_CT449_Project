<template>
  <v-container fluid>
    <v-card flat class="pa-4 rounded-xl elevation-3">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Danh sách Sách</span>
         <router-link to="/book/add">
          <v-btn color="success" prepend-icon="mdi-plus">
            Thêm Sách
          </v-btn>
        </router-link>
      </v-card-title>

      <!-- Bảng sách -->
      <v-data-table
        :headers="headers"
        :items="books"
        class="elevation-1 mt-4"
        no-data-text="Không có dữ liệu"
        :loading="loading"
        loading-text="Đang tải dữ liệu..."
      >
        <template #item.AnhBia="{ item }">
          <v-avatar size="60" rounded="lg">
            <v-img :src="item.AnhBia || defaultImg" cover />
          </v-avatar>
        </template>

        <template #item.actions="{ item }">
            <router-link :to="`/book/edit/${item._id}`">
              <v-btn color="warning" variant="flat" size="small" class="mr-2">
                <v-icon icon="mdi-pencil" class="mr-1" /> Sửa
              </v-btn>
            </router-link>

            <v-btn
              color="error"
              variant="flat"
              size="small"
              class="mr-2"
              @click="deleteBook(item._id)"
            >
              <v-icon icon="mdi-delete" class="mr-1" /> Xóa
            </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog thêm/sửa -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          {{ editedBook._id ? "Chỉnh sửa sách" : "Thêm sách mới" }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field label="Tên sách" v-model="editedBook.TenSach" required />
            <v-text-field label="Tác giả" v-model="editedBook.TacGia" required />
            <v-text-field label="Đơn giá" type="number" v-model.number="editedBook.DonGia" required />
            <v-text-field label="Số quyển" type="number" v-model.number="editedBook.SoQuyen" required />
            <v-text-field label="Năm xuất bản" type="number" v-model.number="editedBook.NamXuatBan" required />
            <v-text-field label="Ảnh bìa (URL)" v-model="editedBook.AnhBia" />
            <v-select
              label="Nhà xuất bản"
              v-model="editedBook.MaNXB"
              :items="publishers"
              item-title="TenNXB"
              item-value="TenNXB"
              required
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text color="grey" @click="closeDialog">Hủy</v-btn>
          <v-btn color="primary" @click="saveBook">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ManageBooks",
  data() {
    return {
      loading: false,
      dialog: false,
      defaultImg: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
      headers: [
        { title: "Ảnh bìa", key: "AnhBia", align: "center" },
        { title: "Tên sách", key: "TenSach" },
        { title: "Tác giả", key: "TacGia" },
        { title: "Đơn giá (VNĐ)", key: "DonGia", align: "center" },
        { title: "Số quyển", key: "SoQuyen", align: "center" },
        { title: "Năm XB", key: "NamXuatBan", align: "center" },
        { title: "Nhà xuất bản", key: "MaNXB.TenNXB" },
        { title: "Thao tác", key: "actions", align: "center", sortable: false },
      ],
      books: [],
      editedBook: {},
    };
  },
  computed: {
    publishers() {
      const names = new Set(this.books.map((b) => b.MaNXB?.TenNXB));
      return Array.from(names).map((name) => ({ TenNXB: name }));
    },
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        this.loading = true;
        const res = await axios.get("/api/books");
        this.books = res.data.map((book) => ({
          ...book,
          MaNXB: book.MaNXB?.TenNXB ? book.MaNXB : { TenNXB: "Không rõ" },
        }));
      } catch (err) {
        console.error("Lỗi khi tải sách:", err);
      } finally {
        this.loading = false;
      }
    },
    openDialog(book = null) {
      this.editedBook = book
        ? JSON.parse(JSON.stringify(book))
        : {
            TenSach: "",
            TacGia: "",
            DonGia: 0,
            SoQuyen: 1,
            NamXuatBan: new Date().getFullYear(),
            AnhBia: "",
            MaNXB: "",
          };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.editedBook = {};
    },
    async saveBook() {
      try {
        if (this.editedBook._id) {
          // PUT: cập nhật sách
          await axios.put(`http://localhost:3000/api/books/${this.editedBook._id}`, this.editedBook);
        } else {
          // POST: thêm sách mới
          await axios.post("http://localhost:3000/api/books", this.editedBook);
        }
        this.fetchBooks();
        this.closeDialog();
      } catch (err) {
        console.error("Lỗi khi lưu sách:", err);
      }
    },
    async deleteBook(id) {
      if (confirm("Bạn có chắc muốn xóa sách này không?")) {
        try {
          await axios.delete(`http://localhost:3000/api/books/${id}`);
          this.fetchBooks();
        } catch (err) {
          console.error("Lỗi khi xóa sách:", err);
        }
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
  },
};
</script>

<style scoped>
.v-card {
  background-color: white;
}
.v-data-table th {
  font-weight: bold;
  background-color: #f0f0f0;
}
.v-avatar img {
  object-fit: cover;
}
</style>
