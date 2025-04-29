<template>
  <div class="ai-assistant">
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.type]">
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          placeholder="输入您的问题..."
          type="text"
          :disabled="isLoading"
        >
        <button @click="sendMessage" :disabled="isLoading">
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AIAssistant',
  data() {
    return {
      messages: [
        { type: 'assistant', content: '您好！我是您的AI助手，有什么可以帮您的吗？' }
      ],
      userInput: '',
      isLoading: false
    }
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      // 添加用户消息
      this.messages.push({
        type: 'user',
        content: this.userInput
      });

      const userMessage = this.userInput;
      this.userInput = '';
      this.isLoading = true;

      try {
        // 调用后端API
        const response = await axios.post('http://localhost:3000/api/ai/chat', {
          message: userMessage
        });

        // 添加AI响应
        this.messages.push({
          type: 'assistant',
          content: response.data.response
        });
      } catch (error) {
        console.error('发送消息失败:', error);
        let errorMessage = '抱歉，我遇到了一些问题，请稍后再试。';
        
        if (error.response) {
          // 服务器返回了错误响应
          errorMessage = `错误: ${error.response.data.error || '服务器错误'}`;
        } else if (error.request) {
          // 请求发送失败
          errorMessage = '无法连接到服务器，请检查网络连接。';
        }
        
        this.messages.push({
          type: 'assistant',
          content: errorMessage
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTop = container.scrollHeight;
    }
  }
}
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 350px;
  z-index: 1000;
}

.chat-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  background: #f0f2f5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.assistant .message-content {
  background: #e3f2fd;
}

.message.user .message-content {
  background: #e8f5e9;
}

.chat-input {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 10px 20px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #1565c0;
}

button:disabled {
  background: #90caf9;
  cursor: not-allowed;
}
</style> 