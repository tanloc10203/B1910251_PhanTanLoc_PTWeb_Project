<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import userApi from "../../api/userApi";
import ChatMessage from "./ChatMessage.vue";

const store = useStore();

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
const textMessage = ref("");
const toUser = ref(null);

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
  toUser.value = {};
});

function onSubmitSendMessage() {}

function onClickSelected(user) {
  toUser.value = user;
}
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5">Danh sách người dùng</h1>
      </div>

      <div class="position-relative">
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="green"
          class="position-absolute"
          style="top: -5px"
        />

        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Họ và tên</th>
              <th class="text-left">E-mail</th>
              <th class="text-left">Quyền</th>
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
        <chat-message v-if="toUser" :toUser="toUser" />
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
