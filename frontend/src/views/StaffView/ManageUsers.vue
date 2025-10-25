<template>
  <v-card>
    <v-card-title class="text-h6">Danh sách người dùng</v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        class="elevation-1"
        loading-text="Đang tải dữ liệu..."
        item-value="_id"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Tìm kiếm theo tên đăng nhập hoặc họ tên..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            class="mb-4"
            clearable
          />
        </template>

        <!-- Avatar -->
        <template #item.Avatar="{ item }">
          <v-avatar size="48">
            <v-img
              :src="item.Avatar || defaultAvatar"
              alt="avatar"
              cover
            ></v-img>
          </v-avatar>
        </template>

        <template #item.actions="{ item }">
          <div v-if="item.TrangThai === 'Active'">
            <v-btn
              size="small"
              color="error"
              class="mr-2"
              @click="blockUser(item._id)"
            >
              Khóa
            </v-btn>
            
          </div>
          <div v-else-if="item.TrangThai === 'Inactive'">
            <v-btn
              size="small"
              color="success"
              @click="unblockUser(item._id)"
            >
              Mở khóa
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
  name: "ManageUsers",
  data() {
    return {
      users: [],
      loading: false,
      search: "",
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      headers: [
        { title: "Ảnh đại diện", key: "Avatar", sortable: false },
        { title: "Tên đăng nhập", key: "TenDangNhap" },
        { title: "Họ tên", key: "HoTen" },
        { title: "Địa chỉ", key: "DiaChi" },
        { title: "Số điện thoại", key: "SoDienThoai" },
        { title: "Hành động", key: "actions", sortable: false },
      ],
    };
  },
  computed: {
    filteredUsers() {
      const query = this.search.toLowerCase().trim();
      if (!query) return this.users;
      return this.users.filter(
        (u) =>
          u.TenDangNhap?.toLowerCase().includes(query) ||
          u.HoTen?.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.users = res.data.userList || [];
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      } finally {
        this.loading = false;
      }
    },
    async blockUser(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:3000/api/staff/block/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message || "Khóa tài khoản thành công!");
        this.fetchUsers();
      } catch (error) {
        alert("Lỗi khi khóa tài khoản!");
        console.error(error);
      }
    },

    async unblockUser(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:3000/api/staff/unblock/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message || "Mở khóa tài khoản thành công!");
        this.fetchUsers();
      } catch (error) {
        alert("Lỗi khi mở khóa tài khoản!");
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.v-data-table {
  background-color: #fff;
}

.v-avatar img {
  object-fit: cover;
}
</style>
