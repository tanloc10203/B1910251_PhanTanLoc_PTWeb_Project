<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import userApi from "../../api/userApi";
import ChatMessage from "./ChatMessage.vue";
import socket from "../../socket";

const store = useStore();
const dispatch = store.dispatch;

const users = ref([]);
const currentUser = computed(() => store.state.auth.user);
const pagination = ref({
  page: 1,
  limit: 5,
  totalRows: 5,
});
const filters = ref({
  page: 1,
  limit: 5,
});
const toUser = ref(null);
const joins = ref([]); // prevJoins
const messages = ref([]);

const checkJoin = (currentJoins = []) => {
  joins.value = currentJoins;
};

onMounted(() => {
  if (store.state["auth"].accessToken) {
    socket.connect();

    socket.on("connect_error", async (err) => {
      console.log(err.message);
    });

    socket.on("join", (data) => {
      checkJoin(data);
    });

    socket.on("joins:connected", (data) => {
      checkJoin(data);
    });

    socket.on("joins:disconnected", (data) => {
      checkJoin(data);
    });

    socket.on("message:getByUserId", (data) => {
      dispatch("chat/SET_MESSAGES", data);
    });

    socket.on("typing", (data) => {
      if (data.to === currentUser.value._id && data.from === toUser.value._id) {
        dispatch("chat/SET_TYPING", data.typing);
      }
    });

    socket.on("message:receive", (data) => {
      if (
        data.receiver === currentUser.value._id &&
        data.sender === toUser.value._id
      ) {
        dispatch("chat/ADD_MESSAGE", data);
      }
    });
  }
});

watch(joins, (joins) => {
  if (!users.value.length) return;

  users.value = users.value.map((u) => {
    if (joins.findIndex((j) => j._id === u._id) != -1) {
      return {
        ...u,
        connected: true,
      };
    }

    return {
      ...u,
      connected: false,
    };
  });
});

async function getAllUser(filters) {
  try {
    const response = await userApi.getAll(filters);
    if (response) {
      users.value = response.elements;
      pagination.value = response.meta.pagination;
    }
  } catch (error) {
    console.log("error getALlUser: ", error);
  }
}

onMounted(() => {
  getAllUser(filters.value);
});

onBeforeUnmount(() => {
  socket.disconnect();
  toUser.value = {};
  joins.value = [];
});

function onClickSelected(user) {
  toUser.value = user;

  socket.emit("message:getByUserId", {
    userId: currentUser.value._id,
    participantId: user._id,
  });
}

function onChangePage() {}
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5">Danh sách người dùng</h1>
      </div>

      <div class="position-relative">
        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Họ và tên</th>
              <th class="text-left">E-mail</th>
              <th class="text-left">Quyền</th>
              <th class="text-left">Trạng thái</th>
              <th class="text-left">Chức năng</th>
            </tr>
          </thead>
          <tbody v-if="users.length">
            <tr v-for="user in users" :key="user._id">
              <td>
                <p class="text-truncate">
                  {{ user.full_name || "Ẩn danh" }}
                </p>
              </td>

              <td>
                <p class="text-truncate">
                  {{ user.email }}
                </p>
              </td>

              <td>
                <p class="text-truncate">
                  {{ user.role }}
                </p>
              </td>

              <td>
                <p class="text-truncate">
                  <v-chip
                    v-if="currentUser._id === user._id || user.connected"
                    class="ma-2"
                    color="secondary"
                    >ONLINE</v-chip
                  >
                  <v-chip v-else class="ma-2" color="red">OFFLINE</v-chip>
                </p>
              </td>

              <td>
                <v-btn
                  v-if="currentUser._id !== user._id"
                  @click="onClickSelected(user)"
                  class="mr-1"
                >
                  Hỏi thăm nhau
                </v-btn>
              </td>
            </tr>
          </tbody>

          <p v-else>Không có người dùng nào</p>
        </v-table>
      </div>

      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalRows"
          @update:modelValue="onChangePage"
        ></v-pagination>
      </div>

      <v-sheet class="mx-auto">
        <chat-message
          v-if="toUser"
          :messagesReceive="messages"
          :toUser="toUser"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style>
.v-table > .v-table__wrapper > table {
  table-layout: fixed;
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 8px 16px;
}
</style>
