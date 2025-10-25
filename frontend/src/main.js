import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

import router from './router';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Import icon font (tuỳ chọn)
import '@mdi/font/css/materialdesignicons.css'

// Tạo instance Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.mount('#app')