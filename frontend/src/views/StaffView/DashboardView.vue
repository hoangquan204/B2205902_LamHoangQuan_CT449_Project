<template>
  <v-app>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <!-- Menu bên trái -->
        <v-col cols="2" class="menu-left">
          <v-list dense nav>
            <v-list-item
              v-for="item in menuItems"
              :key="item.route"
              :active="currentMenu === item.route"
              @click="selectMenu(item.route)"
              class="cursor-pointer"
            >
              <template #prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Nội dung chính -->
        <v-col cols="10" class="content-main pa-6">
          <transition name="fade" mode="out-in">
            <component :is="currentComponent" />
          </transition>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import ManageBooks from "./ManageBooks.vue";
import ManageUsers from "./ManageUsers.vue";
import ManageBorrow from "./ManageBorrow.vue";

export default {
  name: "AdminDashboard",
  components: { ManageBooks, ManageUsers, ManageBorrow },
  data() {
    return {
      currentMenu: "statistics",
      menuItems: [
        { title: "Quản lý sách", icon: "mdi-book-open-page-variant", route: "books" },
        { title: "Quản lý người dùng", icon: "mdi-account-group", route: "users" },
        { title: "Duyệt mượn sách", icon: "mdi-check-decagram", route: "approve" },
      ],
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentMenu) {
        case "books":
          return ManageBooks;
        case "users":
          return ManageUsers;
        default:
          return ManageBorrow;
      }
    },
  },
  methods: {
    selectMenu(route) {
      this.currentMenu = route;
    },
  },
};
</script>

<style scoped>
.menu-left {
  background-color: #f5f5f5;
  height: 100vh;
  border-right: 1px solid #ddd;
}

.content-main {
  background-color: #fff;
  min-height: 100vh;
}

.cursor-pointer {
  cursor: pointer;
}

/* Hiệu ứng chuyển giữa các component */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
