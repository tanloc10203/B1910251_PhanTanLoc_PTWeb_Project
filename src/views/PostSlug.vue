<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  ref,
  watch,
} from "@vue/runtime-core";
import { useRoute } from "vue-router";
import postApi from "../api/postApi";
import CardHome from "../components/CardHome.vue";
import PostDetail from "../components/PostDetail.vue";

export default defineComponent({
  components: {
    CardHome,
    PostDetail,
  },
  setup() {
    const route = useRoute();
    const post = ref();
    const loading = ref(false);

    const slug = computed(() => route.params?.slug);

    const getPostBySlug = async (slug) => {
      loading.value = true;

      try {
        const response = await postApi.getBySlug(slug);

        if (response?.elements) {
          loading.value = false;
          post.value = response?.elements;
        }
      } catch (error) {
        loading.value = false;
        console.log("getPostBySlug error: " + error);
      }
    };

    watch(slug, async (slug) => {
      if (slug) {
        await getPostBySlug(slug);
      }
    });

    onBeforeMount(async () => {
      if (slug.value) {
        await getPostBySlug(slug.value);
      }
    });

    return {
      slug,
      post,
      loading,
    };
  },
});
</script>

<template>
  <v-row>
    <v-col cols="12" sm="8">
      <v-progress-linear
        v-if="loading"
        color="lime"
        indeterminate
        reverse
      ></v-progress-linear>

      <v-sheet rounded="lg" min-height="268">
        <post-detail v-if="!loading" :post="post" />
      </v-sheet>
    </v-col>

    <v-col cols="12" sm="4">
      <v-sheet rounded="lg" min-height="268">
        <card-home />
      </v-sheet>
    </v-col>
  </v-row>
</template>
