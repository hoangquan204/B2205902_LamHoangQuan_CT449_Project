<template>
  <v-container max-width="600px" class="py-6">
    <v-card class="pa-6" elevation="6">
      <v-card-title class="text-h5 font-weight-bold text-center mb-2">
        Chỉnh sửa Sách
      </v-card-title>

      <v-divider class="my-3" />

      <v-form @submit.prevent="updateBook" v-model="valid" ref="form">
        <!-- Tên Sách -->
        <v-text-field
          v-model="book.TenSach"
          label="Tên sách"
          prepend-inner-icon="mdi-book"
          :rules="[rules.required]"
        />

        <!-- Tác Giả -->
        <v-text-field
          v-model="book.TacGia"
          label="Tác giả"
          prepend-inner-icon="mdi-account"
          :rules="[rules.required]"
        />

        <!-- Đơn Giá -->
        <v-text-field
          v-model="book.DonGia"
          label="Đơn giá"
          prepend-inner-icon="mdi-cash"
          type="number"
          :rules="[rules.required, rules.number]"
        />

        <!-- Số Quyển -->
        <v-text-field
          v-model="book.SoQuyen"
          label="Số quyển"
          prepend-inner-icon="mdi-book-multiple"
          type="number"
          :rules="[rules.required, rules.number]"
        />

        <!-- Năm Xuất Bản -->
        <v-text-field
          v-model="book.NamXuatBan"
          label="Năm xuất bản"
          prepend-inner-icon="mdi-calendar"
          type="number"
          :rules="[rules.required, rules.number]"
        />

        <!-- Nhà Xuất Bản -->
        <v-select
          v-model="book.MaNXB"
          :items="publishers"
          item-title="TenNXB"
          item-value="_id"
          label="Nhà xuất bản"
          prepend-inner-icon="mdi-domain"
          :loading="loadingPublishers"
          :rules="[rules.required]"
        />

        <!-- Upload Ảnh -->
        <v-file-input
          label="Ảnh bìa (nếu muốn thay)"
          prepend-inner-icon="mdi-image"
          accept="image/*"
          @change="onImageUpload"
        />

        <!-- Hiển thị ảnh hiện tại hoặc preview -->
        <div class="text-center my-4">
          <v-img
            v-if="previewImage"
            :src="previewImage"
            max-width="200"
            class="mx-auto rounded"
          ></v-img>
          <v-img
            v-else-if="book.AnhBia"
            :src="book.AnhBia"
            max-width="200"
            class="mx-auto rounded"
          ></v-img>
          <p class="text-caption mt-2" v-if="previewImage">(Ảnh mới)</p>
          <p class="text-caption mt-2" v-else-if="book.AnhBia">(Ảnh hiện tại)</p>
        </div>

        <!-- Nút cập nhật -->
        <v-btn :loading="loading" type="submit" color="primary" class="mt-4" block>
          <v-icon start>mdi-content-save</v-icon> Lưu thay đổi
        </v-btn>

        <!-- Thông báo -->
        <v-alert
          v-if="alert.message"
          :type="alert.type"
          class="mt-4"
          border="start"
          elevation="2"
        >
          {{ alert.message }}
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "EditBook",
  data() {
    return {
      valid: false,
      loading: false,
      loadingPublishers: false,
      publishers: [],
      previewImage: null,
      alert: { message: "", type: "info" },
      book: {
        TenSach: "",
        DonGia: "",
        SoQuyen: "",
        NamXuatBan: "",
        MaNXB: "",
        TacGia: "",
        AnhBia: "",
      },
      rules: {
        required: (v) => !!v || "Trường này là bắt buộc",
        number: (v) =>
          !v || !isNaN(Number(v)) || "Vui lòng nhập giá trị số hợp lệ",
      },
    };
  },
  async mounted() {
    await this.fetchPublishers();
    await this.fetchBook();
  },
  methods: {
    async fetchPublishers() {
      this.loadingPublishers = true;
      try {
        const res = await axios.get("http://localhost:3000/api/publishers");
        this.publishers = res.data;
      } catch (err) {
        console.error("Lỗi khi lấy danh sách NXB:", err);
        this.alert = { message: "Không thể tải danh sách NXB!", type: "error" };
      } finally {
        this.loadingPublishers = false;
      }
    },

    async fetchBook() {
      try {
        const token = localStorage.getItem("token");
        const id = this.$route.params.id;
        const res = await axios.get(`http://localhost:3000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.book = res.data;
      } catch (err) {
        console.error("Lỗi khi tải sách:", err);
        this.alert = { message: "Không thể tải thông tin sách!", type: "error" };
      }
    },

    async onImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      this.previewImage = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "book_store"); // preset UNSIGNED
      formData.append("cloud_name", "dxfjbuybf");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dxfjbuybf/image/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        this.book.AnhBia = res.data.secure_url;
        this.alert = { message: "Ảnh tải lên thành công!", type: "success" };
      } catch (err) {
        console.error("Lỗi upload:", err.response?.data || err);
        this.alert = {
          message: err.response?.data?.error?.message || "Lỗi khi tải ảnh!",
          type: "error",
        };
      }
    },

    async updateBook() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.alert.message = "";

      const token = localStorage.getItem("token");
      const id = this.$route.params.id;

      const body = {
        TenSach: this.book.TenSach,
        DonGia: parseFloat(this.book.DonGia),
        SoQuyen: parseInt(this.book.SoQuyen, 10),
        NamXuatBan: parseInt(this.book.NamXuatBan, 10),
        AnhBia:
          this.book.AnhBia ||
          "https://cdn-icons-png.flaticon.com/512/29/29302.png",
        MaNXB: this.book.MaNXB,
        TacGia: this.book.TacGia,
      };

      try {
        await axios.put(`http://localhost:3000/api/books/${id}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.alert = { message: "✅ Cập nhật sách thành công!", type: "success" };
        this.$refs.form.resetValidation();
      } catch (err) {
        console.error("Lỗi khi cập nhật sách:", err);
        this.alert = {
          message:
            err.response?.data?.message || "Lỗi khi cập nhật. Vui lòng thử lại!",
          type: "error",
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
