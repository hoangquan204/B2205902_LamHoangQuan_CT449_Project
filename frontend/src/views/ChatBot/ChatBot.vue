<template>
  <div>
    <!-- Nút mở chatbot -->
    <v-btn
      icon
      color="primary"
      class="chatbot-btn"
      @click="open = true"
    >
      <v-icon>mdi-robot</v-icon>
    </v-btn>

    <!-- Popup Chatbot -->
    <v-card
      v-if="open"
      class="chatbot-card"
      elevation="10"
    >
      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center" style="background-color:#1976d2; color:white;">
        <div class="d-flex align-center">
          <v-badge
            dot
            overlap
            class="me-2"
            color="green"
          >
            <v-icon large>mdi-robot</v-icon>
          </v-badge>
          <div>
            <div>Chatbot</div>
            <div class="text-caption">Thường trả lời sau vài giây</div>
          </div>
        </div>
        <v-btn icon @click="open = false" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Nội dung chat -->
      <v-card-text class="chatbot-body">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="msg.role === 'user' ? 'user-message' : 'bot-message'"
        >
          <div
            class="message-bubble"
            :class="msg.role === 'user' ? 'user-bubble' : 'bot-bubble'"
          >
            {{ msg.text }}
          </div>
        </div>
        <div ref="bottomRef"></div>
      </v-card-text>

      <!-- Input, hint chips và nút gửi -->
      <v-card-actions class="flex-column align-start pa-3">
        <!-- Hint Chips nằm sát input -->
        <div class="d-flex flex-wrap mb-2 chips-container">
          <v-chip
            v-for="(item, key) in Object.keys(hintData)"
            :key="key"
            small
            outlined
            class="me-1 mb-1 hint-chip"
            color="primary"
            @click="input = item; sendMessage()"
          >
            {{ item }}
          </v-chip>
        </div>

        <div class="d-flex w-100 input-container">
          <v-text-field
            v-model="input"
            placeholder="Nhập tin nhắn..."
            dense
            outlined
            rounded
            hide-details
            class="flex-grow-1 me-2"
            @keydown.enter="sendMessage"
          ></v-text-field>
          <v-btn 
            icon 
            :color="input.length > 0 ? 'primary' : 'grey'" 
            @click="sendMessage"
            class="send-btn"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ChatBotUI",
  data() {
    return {
      open: false,
      input: "",
      messages: [
        { role: "bot", text: "Chào mừng bạn! Tôi là Chatbot, bạn cần giúp gì?" },
      ],
      hintData: {
        "Cách mượn sách": "Để mượn sách, bạn cần đăng nhập, tìm kiếm sách và click vào nút 'MƯỢN'. Sau đó cần chấp nhận các điều khoản mượn sách và gửi yêu cầu mượn sách. Nhân viên thư viện sẽ xử lý yêu cầu của bạn. Sau khi yêu cầu đã được phê duyệt bạn có thể đến thư viện và nhận sách.",
        "Đăng ký tài khoản": "Để đăng ký tài khoản, click nút Đăng nhập trên menu chính và chọn Đăng ký tài khoản trong form đăng nhập. Bạn cần điền các thông tin cần thiết để tạo tài khoản trên website.",
        "Chức năng chính của website": "Website này cho phép người dùng tìm kiếm, mượn và quản lý sách trực tuyến. Người dùng có thể đăng ký tài khoản, duyệt danh mục sách, mượn sách và theo dõi trạng thái mượn sách của mình.",
        "Nguyên tắc hoạt động": "Website hoạt động dựa trên việc cung cấp thông tin về sách và quản lý quá trình mượn sách. Người dùng cần tuân thủ các quy định về mượn sách và sử dụng dịch vụ một cách hợp lý, tránh hư hại sách và trả sách đúng hạn.",
      },
    };
  },
  methods: {
    sendMessage() {
      if (!this.input.trim()) return;

      // Thêm message của user
      this.messages.push({ role: "user", text: this.input.trim() });

      // Kiểm tra câu hỏi mẫu
      let botReply = "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử lại với các chủ đề có sẵn bên dưới.";
      if (this.hintData[this.input.trim()]) {
        botReply = this.hintData[this.input.trim()];
      }

      // Reset input
      const userInput = this.input.trim();
      this.input = "";

      // Đẩy câu trả lời bot sau 0.5s
      setTimeout(() => {
        this.messages.push({ role: "bot", text: botReply });
        this.scrollToBottom();
      }, 500);

      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.bottomRef;
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    },
  },
};
</script>

<style scoped>
.chatbot-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 100;
}

.chatbot-card {
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 400px;
  height: 70vh;
  display: flex;
  flex-direction: column;
  z-index: 101;
  border-radius: 12px;
  overflow: hidden;
}

.chatbot-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8f9fa;
}

/* Container cho tin nhắn */
.message-wrapper {
  display: flex;
  margin-bottom: 16px;
  width: 100%;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

/* Bubble tin nhắn */
.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.4;
}

.user-bubble {
  background-color: #1976d2;
  color: white;
  border-bottom-right-radius: 4px;
}

.bot-bubble {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Container cho hint chips */
.chips-container {
  width: 100%;
  max-height: 80px;
  overflow-y: auto;
}

.hint-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.hint-chip:hover {
  background-color: #d3d3d3;
  color: white;
}

.input-container {
  width: 100%;
}

.send-btn {
  flex-shrink: 0;
}

/* Scrollbar styling */
.chatbot-body::-webkit-scrollbar {
  width: 6px;
}

.chatbot-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chatbot-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chatbot-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>