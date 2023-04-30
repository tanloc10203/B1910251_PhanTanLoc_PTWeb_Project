<script setup>
import { ref } from "vue";

const props = defineProps({
  toUser: {
    type: Object,
    required: true,
  },
});

const messages = ref([]);
</script>

<template>
  <div class="chat">
    <div class="chat-content">
      <div class="chat-content--header">
        <div class="chat-content--header-left">
          <span class="chat-content--header-left-to">Đến: </span>
          <span class="chat-content--header-left-name">
            {{ `${toUser.email} (${toUser.full_name || "Ẩn danh"})` }}
          </span>
        </div>

        <div class="chat-content--header-right">
          <i class="fa-sharp fa-solid fa-phone"></i>
          <i class="fa-sharp fa-solid fa-video"></i>
        </div>
      </div>

      <div class="chat-content--main">
        <div class="message parker">
          {msg.content} {msg.content} {msg.content} {msg.content} {msg.content}
          {msg.content}
        </div>
        <div class="message stark">{msg.content}</div>
        <div class="message parker">{msg.content}</div>
        <div class="message stark">{msg.content}</div>

        <div class="message parker">{msg.content}</div>
        <div class="message stark">{msg.content}</div>
        <div class="message parker">{msg.content}</div>
        <div class="message stark">{msg.content}</div>
        <div class="message parker">{msg.content}</div>

        <div class="message stark">{msg.content}</div>
        <div class="message parker">{msg.content}</div>
        <div class="message stark">{msg.content}</div>

        <div class="message stark">{msg.content}</div>
        <div class="message parker">{msg.content}</div>
        <div class="message stark">{msg.content}</div>

        <div class="message stark">{msg.content}</div>
        <div class="message parker">{msg.content}</div>
        <div class="message stark">{msg.content}</div>

        <div class="message stark">
          <div class="typing typing-1"></div>
          <div class="typing typing-2"></div>
          <div class="typing typing-3"></div>
        </div>
      </div>

      <div class="chat-content--input">
        <div class="form-group chat-content--input-text">
          <input
            type="text"
            placeholder="Type your message here..."
            class="form-control"
          />
        </div>

        <div class="chat-content--input-bottom">
          <div class="chat-content--input-bottom-icon">
            <i class="fa-sharp fa-solid fa-link"></i>
            <i class="fa-sharp fa-solid fa-image"></i>
          </div>

          <button type="submit" class="btn">Reply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap");

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  height: 100%;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.form-group {
  width: 100%;
  display: flex;
  position: relative;
}

.form-control {
  outline: none;
  border: none;
  padding: 14px 40px;
  width: 100%;
  display: block;
  border-radius: 20px;
}

.form-control::placeholder {
  color: rgb(168, 160, 160);
  font-weight: 500;
}

.form-group i {
  color: rgb(168, 160, 160);
  cursor: pointer;
  position: absolute;
  top: 30%;
  right: 20px;
}

.btn {
  padding: 8px 22px;
  text-transform: uppercase;
  outline: none;
  border: none;
  border-radius: 5px;
  background: #3ab0ff;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn:hover {
  opacity: 0.7;
}

/* wrapper */
.chat {
  margin-top: 20px;
  display: flex;
  height: 650px;
  width: 100%;
}

/* Content */
.chat-content {
  width: 100%;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

/* Content header */
.chat-content--header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  color: #3ab0ff;
  border: 2px solid #eee;
}

.chat-content--header-left-to {
  color: #ddd;
  margin-right: 10px;
}

.chat-content--header-left-name {
  border-bottom: 1px dotted;
  font-weight: 600;
}

.chat-content--header-right {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 20px;
}

/* Chat */
.chat-content--main {
  overflow-y: auto;
}

.chat-content--main::-webkit-scrollbar {
  display: none;
}

.chat-content--main .message {
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  margin: 1rem;
  background: #fff;
  border-radius: 1.125rem 1.125rem 1.125rem 0;
  min-height: 2.25rem;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 66%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075),
    0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
}

.chat-content--main .message.parker {
  margin: 1rem 1rem 1rem auto;
  border-radius: 1.125rem 1.125rem 0 1.125rem;
  background: #333;
  color: white;
}

.chat-content--main .message .typing {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0rem;
  box-sizing: border-box;
  background: #ccc;
  border-radius: 50%;
}

.chat-content--main .message .typing.typing-1 {
  -webkit-animation: typing 3s infinite;
  animation: typing 3s infinite;
}

.chat-content--main .message .typing.typing-2 {
  -webkit-animation: typing 3s 250ms infinite;
  animation: typing 3s 250ms infinite;
}

.chat-content--main .message .typing.typing-3 {
  -webkit-animation: typing 3s 500ms infinite;
  animation: typing 3s 500ms infinite;
}

.chat-content--input {
  border-top: 2px solid #eee;
}

.chat-content--input-text {
  margin-top: 8px;
}

.chat-content--input-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
  padding: 0 38px;
  color: #3ab0ff;
}

.chat-content--input-bottom-icon {
  cursor: pointer;
  display: flex;
  gap: 10px;
}

@-webkit-keyframes typing {
  0%,
  75%,
  100% {
    transform: translate(0, 0.25rem) scale(0.9);
    opacity: 0.5;
  }
  25% {
    transform: translate(0, -0.25rem) scale(1);
    opacity: 1;
  }
}

@keyframes typing {
  0%,
  75%,
  100% {
    transform: translate(0, 0.25rem) scale(0.9);
    opacity: 0.5;
  }
  25% {
    transform: translate(0, -0.25rem) scale(1);
    opacity: 1;
  }
}
</style>
