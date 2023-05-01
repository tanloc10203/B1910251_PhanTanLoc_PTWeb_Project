<script>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import categoryApi from "../api/categoryApi";
import CardHomeItem from "../components/CardHomeItem.vue";
import OverlayCustom from "../components/OverlayCustom.vue";

export default defineComponent({
  components: {
    CardHomeItem,
    OverlayCustom,
  },
  setup() {
    const route = useRoute();
    const categories = ref();
    const slug = computed(() => route.params?.slug);
    const store = useStore();
    const posts = computed(() => store.state["post"].posts);
    const loading = computed(() => store.state["post"].isLoading);

    const filters = computed(() => store.state["post"].filters);
    const pagination = computed(() => store.state["post"].pagination);

    const getBySlug = async (slug) => {
      try {
        const response = await categoryApi.getBySlug(slug);

        if (response) {
          categories.value = response.elements;
          const {
            elements: { childrens, _id },
          } = response;

          if (childrens.length > 0) {
            let childrensString = childrens.reduce(
              (result, currentChild) => result + ";" + currentChild._id,
              ""
            );

            childrensString = childrensString.slice(1, childrensString.length);

            const filters = {
              page: 1,
              limit: 15,
              where: "category_id," + childrensString,
            };

            store.dispatch("post/fetchAllPost", filters);
          } else {
            const filters = {
              page: 1,
              limit: 15,
              where: "category_id," + _id,
            };
            store.dispatch("post/fetchAllPost", filters);
          }
        }
      } catch (error) {
        console.log("getBySlug error: " + error);
      }
    };

    watch(
      () => route.params?.slug,
      async (slug) => {
        await getBySlug(slug);
      }
    );

    onMounted(async () => {
      if (slug.value) {
        await getBySlug(slug.value);
      }
    });

    onBeforeUnmount(() => {
      store.dispatch("post/reset");
    });

    const visibilityChanged = (isVisibilityChanged) => {
      if (!isVisibilityChanged) return;

      let oldPage = filters.value.page;

      if (oldPage >= pagination.value.totalRows) return;

      store.dispatch("post/changeFilter", {
        page: ++oldPage,
      });

      store.dispatch("post/fetchAllPost", {
        ...filters.value,
        isHome: true,
      });
    };

    return {
      slug,
      posts,
      loading,
      categories,
      visibilityChanged,
    };
  },
});
</script>

<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6">
      <v-card class="mx-auto">
        <v-card-title class="text-h4">
          Danh sách bài viết theo danh mục
        </v-card-title>

        <v-chip-group class="ma-2">
          <v-chip v-if="categories">{{ categories.name }}</v-chip>
          <div v-if="categories && categories.childrens">
            <v-chip v-for="child in categories.childrens" :key="child._id">
              {{ child.name }}
            </v-chip>
          </div>
        </v-chip-group>

        <v-card-title v-if="posts.length === 0">Không có nội dung</v-card-title>

        <overlay-custom :open="loading" />

        <v-container>
          <v-row dense>
            <card-home-item
              v-for="post in posts"
              :key="post._id"
              :item="post"
            />

            <div
              v-if="posts.length"
              v-observe-visibility="visibilityChanged"
            ></div>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>
