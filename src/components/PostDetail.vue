<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
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
      <v-card-title class="text-h4 my-5">{{ post.title }}</v-card-title>

      <v-card-subtitle>
        <span class="font-weight-bold text-h6 me-3">{{ post.author }}</span>
        <span>{{ timeStamp }}</span>
      </v-card-subtitle>

      <v-card-text>{{ post.detail_text }}</v-card-text>

      <v-card-text v-html="post.detail_html"></v-card-text>
    </div>
  </v-content>
</template>

<style>
figure img {
  width: 100%;
}
</style>
