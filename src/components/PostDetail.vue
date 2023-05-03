<script>
import { computed, defineComponent } from "@vue/runtime-core";
import moment from "moment";

export default defineComponent({
  props: {
    post: {
      post: Object,
      required: true,
    },
  },
  setup({ post }) {
    const timeStamp = computed(() => moment(post.createdAt).fromNow());

    return {
      timeStamp,
    };
  },
});
</script>

<template>
  <v-content class="pa-2">
    <div>
      <v-btn variant="text" :to="`/category/${post.category.parent.slug}`">
        {{ post.category.parent.name }}
      </v-btn>
      <span>/</span>
      <v-btn variant="text" :disabled="true">{{ post.category.name }}</v-btn>
    </div>

    <div>
      <p class="text-h4 my-5">{{ post.title }}</p>

      <p>
        <span class="font-weight-bold text-h6 me-3">{{ post.author }}</span>
        <span>{{ timeStamp }}</span>
      </p>

      <i class="mb-2">{{ post.detail_text }}</i>

      <div v-html="post.detail_html"></div>
    </div>
  </v-content>
</template>

<style>
figure img {
  width: 100%;
}
</style>
