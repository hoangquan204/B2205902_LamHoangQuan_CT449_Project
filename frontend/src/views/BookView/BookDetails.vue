<template>
  <v-container class="py-10">
    <v-row>
      <!-- CỘT TRÁI: Thông tin sách (nhỏ gọn) -->
      <v-col cols="12" md="4">
        <v-card v-if="book" elevation="10" rounded="xl" class="pa-4 book-card">
          
          <!-- Ảnh bìa -->
          <v-img
            :src="book.AnhBia || defaultImage"
            height="220"
            width="160"
            class="mx-auto rounded mb-4"
            contain
          ></v-img>

          <!-- Tên sách -->
          <h3 class="text-center font-weight-bold mb-1">{{ book.TenSach }}</h3>
          <p class="text-center text-grey text-subtitle-2 mb-4">Tác giả: {{ book.TacGia }}</p>

          <v-divider class="mb-4"></v-divider>

        <!-- Thông tin chi tiết: 2 cột -->
<v-row class="mt-1">
  <v-col cols="6">
    <v-card flat class="pa-1 info-box">
      <p class="label">Nhà Xuất Bản</p>
      <p class="value">{{ book.MaNXB?.TenNXB || "Không rõ" }}</p>
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card flat class="pa-1 info-box">
      <p class="label">Năm Xuất Bản</p>
      <p class="value">{{ book.NamXuatBan }}</p>
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card flat class="pa-1 info-box">
      <p class="label">Giá</p>
      <p class="value">{{ formatCurrency(book.DonGia) }}</p>
    </v-card>
  </v-col>

  <v-col cols="6">
    <v-card flat class="pa-1 info-box">
      <p class="label">Số lượt mượn</p>
      <p class="value">{{ book.SoLuotMuon }} lượt</p>
    </v-card>
  </v-col>
</v-row>


          <!-- Nút mượn -->
          <router-link :to="`/book/borrow/${book._id}`">
          <v-btn color="primary" block class="mt-4">
            <v-icon start>mdi-book-check</v-icon> Mượn sách
          </v-btn>
          </router-link>
        </v-card>

        <v-alert v-else type="error" class="mt-6 text-center">
          Không tìm thấy sách!
        </v-alert>
      </v-col>

      <!-- CỘT PHẢI: Bình luận & Đánh giá -->
      <v-col cols="12" md="8">
        <v-card elevation="8" rounded="xl" class="pa-6 comment-card">
          <h3 class="text-h6 font-weight-bold mb-4">💬 Bình luận & Đánh giá</h3>

          <!-- Đánh giá sao -->
          <v-rating v-model="rating" half-increments length="5" class="mb-4"></v-rating>

          <!-- Form bình luận -->
          <v-textarea
            v-model="newComment"
            label="Viết bình luận của bạn..."
            clearable
            auto-grow
          ></v-textarea>

          <v-btn color="primary" class="mt-2" @click="addComment" :loading="loading">
            <v-icon start>mdi-send</v-icon> Gửi
          </v-btn>

          <v-divider class="my-4"></v-divider>

          <!-- Danh sách bình luận -->
          <div v-if="comments.length">
           <v-card
  v-for="(cmt, index) in comments"
  :key="index"
  class="mb-3 pa-3"
  outlined
>
  <div class="d-flex align-center justify-space-between mb-1">
    <!-- Avatar + Tên -->
    <div class="d-flex align-center">
     <v-avatar size="40" class="mr-2">
              <v-img src="https://cdn-icons-png.flaticon.com/512/149/149071.png"></v-img>
            </v-avatar>
      <strong>{{ cmt.MaNguoiDung?.TenDangNhap || "Ẩn danh" }}</strong>
    </div>

    <!-- Rating + Ngày -->
    <div class="text-right">
      <v-rating
        :model-value="cmt.DanhGia"
        dense readonly size="14"
        class="mb-1"
      ></v-rating>
      <div class="text-grey text-caption">{{ formatDate(cmt.NgayBinhLuan) }}</div>
    </div>
  </div>

  <!-- Nội dung bình luận -->
  <p class="mt-1">{{ cmt.NoiDung }}</p>
</v-card>


          </div>
          <div v-else class="text-grey text-center">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "BookDetail",
  data() {
    return {
      book: null,
      loading: false,
      defaultImage: 'https://cdn-icons-png.flaticon.com/512/29/29302.png',
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 0,
      newComment: "",
      comments: []
    };
    
  },
  async created() {
    await this.fetchBookDetail();
    await this.fetchComments();
  },
  methods: {
    async fetchBookDetail() {
      try {
        this.loading = true;
        const id = this.$route.params.id;
        const response = await axios.get(`/api/books/${id}`);
        this.book = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchComments() {
       try {
        this.loading = true;
        const id = this.$route.params.id;
        const response = await axios.get(`/api/comments/${id}`);
        this.comments = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bình luận:", error);
      } finally {
        this.loading = false;
      }
    },
    async addComment() {
     try {
        const id = this.$route.params.id;
        const res = await axios.post(`/api/comments/${id}`, {NoiDung: this.newComment, DanhGia: this.rating}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.newComment = "";
        this.rating = 0;
        await this.fetchComments();
      } catch (err) {
        console.error("Lỗi khi thêm bình luận:", err);
      } finally {
        this.loading = false;   
      }
        
    },
    formatCurrency(value) {
      if (!value) return '—';
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    postComment() {
      if (!this.newComment.trim()) return;
      this.comments.push({
        user: "Người dùng ẩn danh",
        rating: this.rating || 0,
        text: this.newComment
      });
      this.newComment = "";
      this.rating = 0;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
};
</script>

<style scoped>
.book-card {
  background: #f9f9f9;
}

.info-item {
  margin-bottom: 8px;
}
.comment-card {
  background: #fafafa;
}
.info-box {
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 12px;
  transition: 0.2s;
}
.info-box:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.label {
  font-size: 12px;
  color: #777;
  margin-bottom: 4px;
}
.value {
  font-weight: bold;
  color: #333;
}

</style>
