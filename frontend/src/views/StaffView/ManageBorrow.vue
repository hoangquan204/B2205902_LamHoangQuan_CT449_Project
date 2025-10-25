<template>
  <v-card>
    <v-card-title class="text-h6 d-flex align-center justify-space-between">
      Danh sách phiếu mượn
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <!-- Bộ lọc trạng thái -->
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        label="Lọc theo trạng thái"
        dense
        clearable
        style="max-width: 250px"
        variant="outlined"
      ></v-select>

      <v-data-table
        :headers="headers"
        :items="filteredBorrows"
        :loading="loading"
        loading-text="Đang tải dữ liệu..."
        class="elevation-1"
        item-value="_id"
      >
        <!-- Cột ảnh bìa -->
        <template #item.MaSach.AnhBia="{ item }">
          <div
            style="
              width: 80px;
              height: 80px;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
            "
          >
            <v-img
              :src="item.MaSach?.AnhBia || defaultCover"
              alt="Ảnh bìa"
              cover
            ></v-img>
          </div>
        </template>

        <!-- Cột Ngày mượn -->
        <template #item.NgayMuon="{ item }">
          {{ formatDate(item.NgayMuon) }}
        </template>

        <!-- Cột Ngày trả -->
        <template #item.NgayTra="{ item }">
          {{ formatDate(item.NgayTra) }}
        </template>

        <!-- Cột Trạng thái -->
        <template #item.TrangThai="{ item }">
          <v-chip :color="getStatusColor(item.TrangThai)" dark size="small">
            {{ item.TrangThai }}
          </v-chip>
        </template>

        <!-- Cột hành động -->
        <template #item.actions="{ item }">
          <div v-if="item.TrangThai === 'Đang chờ duyệt'">
            <v-btn
              size="small"
              color="success"
              class="mr-2"
              @click="approveBorrow(item._id)"
            >
              Duyệt
            </v-btn>
            <v-btn
              size="small"
              color="error"
              @click="rejectBorrow(item._id)"
            >
              Từ chối
            </v-btn>
          </div>

          <div v-else-if="item.TrangThai === 'Đã duyệt'">
            <v-btn
              size="small"
              color="info"
              @click="markAsReturned(item._id)"
            >
              Đã trả
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "ManageBorrow",
  data() {
    return {
      borrows: [],
      loading: false,
      selectedStatus: null,
      defaultCover: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
      statusOptions: ["Đang chờ duyệt", "Đã duyệt", "Đã từ chối", "Đã trả"],
      headers: [
        { title: "Ảnh bìa", key: "MaSach.AnhBia", sortable: false },
        { title: "Tên sách", key: "MaSach.TenSach" },
        { title: "Người mượn", key: "MaNguoiDung.TenDangNhap" },
        { title: "Trạng thái", key: "TrangThai" },
        { title: "Ngày mượn", key: "NgayMuon" },
        { title: "Ngày trả", key: "NgayTra" },
        { title: "Hành động", key: "actions", sortable: false },
      ],
    };
  },
  computed: {
    filteredBorrows() {
      if (!this.selectedStatus) return this.borrows;
      return this.borrows.filter((b) => b.TrangThai === this.selectedStatus);
    },
  },
  methods: {
    async fetchBorrowList() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/borrow", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.borrows = res.data || [];
      } catch (error) {
        console.error("Lỗi khi tải danh sách mượn sách:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserInfo() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/user/`", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.borrows = res.data || [];
      } catch (error) {
        console.error("Lỗi khi tải danh sách mượn sách:", error);
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "—";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    getStatusColor(status) {
      switch (status) {
        case "Đang chờ duyệt":
          return "orange";
        case "Đã duyệt":
          return "green";
        case "Đã từ chối":
          return "red";
        case "Đã trả":
          return "blue";
        default:
          return "grey";
      }
    },

    // ✅ API: Duyệt phiếu
    async approveBorrow(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:3000/api/borrow/approve/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message || "Duyệt đơn thành công!");
        this.fetchBorrowList();
      } catch (error) {
        alert("❌ Lỗi khi duyệt phiếu!");
        console.error(error);
      }
    },

    // ❌ API: Từ chối phiếu
    async rejectBorrow(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:3000/api/borrow/reject/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message || "Đã từ chối phiếu!");
        this.fetchBorrowList();
      } catch (error) {
        alert("❌ Lỗi khi từ chối phiếu!");
        console.error(error);
      }
    },

    // 📦 API: Đánh dấu đã trả
    async markAsReturned(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:3000/api/borrow/return/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message || "Cập nhật trạng thái thành công!");
        this.fetchBorrowList();
      } catch (error) {
        alert("❌ Lỗi khi cập nhật trạng thái!");
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchBorrowList();
  },
};
</script>

<style scoped>
.v-data-table {
  background-color: #fff;
}
</style>
