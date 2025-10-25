import { createWebHistory, createRouter } from "vue-router";

import ListBook from "@/views/BookView/ListBook.vue";
import AddBook from "@/views/BookView/AddBookView.vue";
import EditBook from "@/views/BookView/EditBookView.vue";
import BorrowBook from "@/views/BookView/BorrowBook.vue";

import LoginView from "@/views/StaffView/LoginView.vue";

import UserLoginView from "@/views/UserView/UserLoginView.vue";
import UserProfileView from "@/views/UserView/UserProfileView.vue";
import UserRegisterView from "@/views/UserView/UserRegisterView.vue";
import DashboardView from "@/views/StaffView/DashboardView.vue";
import BookDetails from "@/views/BookView/BookDetails.vue";

const routes = [
    {
        path: "/",
        name: "List book",
        component: ListBook
    },
    {
        path: "/book/add",
        name: "Add book",
        component: AddBook
    },
    {
        path: "/book/detail/:id",
        name: "Book detail",
        component: BookDetails
    },
    {
        path: "/book/edit/:id",
        name: "Edit book",
        component: EditBook
    },
    {
        path: "/book/borrow/:id",
        name: "Borrow book",
        component: BorrowBook
    },
    {
        path: "/login",
        name: "Login",
        component: UserLoginView
    },
    {
        path: "/register",
        name: "Register",
        component: UserRegisterView
    },
    {
        path: "/profile",
        name: "Profile",
        component: UserProfileView
    },
    {
        path: "/staff/login",
        name: "Login Staff",
        component: LoginView
    },
     {
        path: "/staff/dashboard",
        name: "Staff dashboard",
        component: DashboardView
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;