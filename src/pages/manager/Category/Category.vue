<script setup>
import MenuList from "../../../components/manager/MenuList.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import categoryApi from "../../../api/categoryApi";
import Toast from "../../../components/Toast.vue";

const store = useStore();

const categories = computed(() => store.state.category.categories);
const isLoading = computed(() => store.state.category.isLoading);
const filters = computed(() => store.state["category"].filters);
const pagination = computed(() => store.state["category"].pagination);

const back = ref(false);
const selected = ref();
const dialog = ref(false);

store.dispatch("category/fetchAllCategory", { ...filters.value, page: 1 });

watch(
  () => store.state["category"].filters,
  (filters) => {
    store.dispatch("category/fetchAllCategory", filters);
  }
);

const handleOpenDelete = (category) => {
  selected.value = category;
  dialog.value = true;
};

const handleDelete = async (category) => {
  try {
    dialog.value = false;
    const response = await categoryApi.delete({ id: category._id });
    if (response) {
      store.dispatch("toast/startToast", {
        text: "Xoá danh mục thành công",
        color: "success",
        open: true,
      });
      store.dispatch("category/fetchAllCategory", {
        ...filters.value,
        page: 1,
      });
    }
  } catch (error) {
    console.log("handleDelete error:::", error);
  }
};

const changePage = (newPage) => {
  store.dispatch("category/changeFilter", { ...filters.value, page: newPage });
};

const handleShowChildren = (category) => {
  back.value = true;
  store.dispatch("category/changeFilter", {
    ...filters.value,
    page: 1,
    where: "parent_id," + category._id,
    isCategory: true,
  });
};

const handleBack = () => {
  back.value = false;
  store.dispatch("category/changeFilter", {
    ...filters.value,
    page: 1,
    where: "level,1",
  });
};
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5">Danh mục</h1>

        <router-link class="text-decoration-none" to="/manager/category/add">
          <v-btn>Thêm danh mục</v-btn>
        </router-link>
      </div>

      <v-btn v-if="back" class="mb-5" @click="handleBack">Quay trở lại</v-btn>

      <div class="position-relative">
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="green"
          class="position-absolute"
        />

        <v-table>
          <thead>
            <tr>
              <th class="text-left">Tên danh mục</th>
              <th class="text-left">Slug</th>
              <th class="text-left">Level</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.slug }}</td>
              <td>{{ item.level }}</td>
              <th class="text-center">
                <menu-list
                  :selected="item"
                  :onOpenDelete="handleOpenDelete"
                  :onShowChildren="handleShowChildren"
                />
              </th>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
          <v-card-title class="text-h5"> Xác nhận trước khi xoá </v-card-title>
          <v-card-text
            >Bạn có muốn xoá danh mục
            <strong>`{{ selected.name }}`</strong></v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="dialog = false">
              Huỷ
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="handleDelete(selected)"
            >
              Xoá
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalRows"
          @update:modelValue="changePage"
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>
