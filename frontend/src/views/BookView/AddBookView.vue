<template>
  <v-container max-width="600px" class="py-6">
    <v-card class="pa-6" elevation="6">
       <v-card-title class="text-h5 font-weight-bold text-center mb-2">
        Thêm Sách Mới
      </v-card-title>
     
      <v-divider class="my-3" />

      <v-form @submit.prevent="addBook" v-model="valid" ref="form">
        <!-- Upload Ảnh -->
        <v-file-input
          label="Ảnh bìa"
          prepend-inner-icon="mdi-image"
          accept="image/*"
          @change="onImageUpload"
        />

        <v-progress-linear
          v-if="uploadingImage"
          indeterminate
          color="primary"
          class="my-3"
        />

        <div v-if="previewImage" class="my-4 text-center">
          <v-img
            :src="previewImage"
            max-width="200"
            max-height="200"
            class="mx-auto rounded"
          ></v-img>
        </div>

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
        <v-row>
          <v-col cols="9">
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
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <v-btn
              color="secondary"
              variant="outlined"
              block
              @click="showAddPublisher = true"
            >
              <v-icon start>mdi-plus</v-icon> NXB
            </v-btn>
          </v-col>
        </v-row>

        <!-- Modal thêm NXB -->
        <v-dialog v-model="showAddPublisher" max-width="450px">
          <v-card>
            <v-card-title class="font-weight-bold text-h6">
              ➕ Thêm Nhà Xuất Bản
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form ref="publisherForm" v-model="publisherValid">
                <v-text-field
                  v-model="newPublisher.TenNXB"
                  label="Tên nhà xuất bản"
                  prepend-inner-icon="mdi-domain"
                  :rules="[rules.required]"
                />
                <v-text-field
                  v-model="newPublisher.DiaChi"
                  label="Địa chỉ"
                  prepend-inner-icon="mdi-map-marker"
                  :rules="[rules.required]"
                />
              </v-form>
              <v-alert
                v-if="publisherAlert.message"
                :type="publisherAlert.type"
                class="mt-3"
                border="start"
                elevation="2"
              >
                {{ publisherAlert.message }}
              </v-alert>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn variant="text" color="grey" @click="showAddPublisher = false">
                Hủy
              </v-btn>
              <v-btn
                color="primary"
                :loading="addingPublisher"
                @click="addPublisher"
              >
                Lưu
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Nút thêm -->
        <v-btn
          :loading="loading"
          type="submit"
          color="primary"
          class="mt-4"
          block
        >
          <v-icon start>mdi-plus</v-icon> Thêm Sách
        </v-btn>

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
  name: "AddBook",
  data() {
    return {
      valid: false,
      loading: false,
      loadingPublishers: false,
      uploadingImage: false,
      showAddPublisher: false, // 👈 trạng thái mở modal
      addingPublisher: false,
      publisherValid: false,
      publishers: [],
      previewImage: null,
      alert: { message: "", type: "info" },
      publisherAlert: { message: "", type: "info" },
      book: {
        TenSach: "",
        DonGia: "",
        SoQuyen: "",
        NamXuatBan: "",
        MaNXB: "",
        TacGia: "",
        AnhBia: "",
      },
      newPublisher: {
        TenNXB: "",
        DiaChi: "",
      },
      rules: {
        required: (v) => !!v || "Trường này là bắt buộc",
        number: (v) =>
          !v || !isNaN(Number(v)) || "Vui lòng nhập giá trị số hợp lệ",
      },
    };
  },
  mounted() {
    this.fetchPublishers();
  },
  methods: {
    // 📘 Lấy danh sách NXB
    async fetchPublishers() {
      this.loadingPublishers = true;
      try {
        const res = await axios.get("http://localhost:3000/api/publishers");
        this.publishers = res.data;
      } catch (err) {
        this.alert = {
          message: "Không thể tải danh sách nhà xuất bản!",
          type: "error",
        };
      } finally {
        this.loadingPublishers = false;
      }
    },

   async addPublisher() {
  if (!this.$refs.publisherForm.validate()) return;
  this.addingPublisher = true;
  this.publisherAlert.message = "";

  try {
    const res = await axios.post("http://localhost:3000/api/publishers", this.newPublisher);

    // ✅ Thêm đúng bằng dữ liệu trả về (có _id)
    this.publishers.push(res.data.publisher);

    this.showAddPublisher = false;
    this.newPublisher = { TenNXB: "", DiaChi: "" };
    this.publisherAlert = { message: "", type: "" };
  } catch (err) {
    console.error("Lỗi thêm NXB:", err);
    this.publisherAlert = {
      message: err.response?.data?.message || "Không thể thêm nhà xuất bản!",
      type: "error",
    };
  } finally {
    this.addingPublisher = false;
  }
},


    // 🖼️ Upload ảnh lên Cloudinary
    async onImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.previewImage = URL.createObjectURL(file);
      this.uploadingImage = true;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "book_store");
      formData.append("cloud_name", "dxfjbuybf");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dxfjbuybf/image/upload",
          formData
        );
        this.book.AnhBia = res.data.secure_url;
      } catch (err) {
        this.alert = {
          message: "Lỗi tải ảnh lên Cloudinary!",
          type: "error",
        };
      } finally {
        this.uploadingImage = false;
      }
    },

    // ➕ Thêm sách
    async addBook() {
      if (!this.$refs.form.validate()) return;
      if (!this.book.AnhBia) {
        this.alert = { message: "Vui lòng tải ảnh bìa!", type: "warning" };
        return;
      }

      this.loading = true;
      const token = localStorage.getItem("token");

      try {
        await axios.post("http://localhost:3000/api/books", this.book, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.alert = { message: "✅ Thêm sách thành công!", type: "success" };
        this.$refs.form.reset();
        this.previewImage = null;
      } catch (err) {
        this.alert = {
          message: err.response?.data?.message || "Lỗi khi thêm sách!",
          type: "error",
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
