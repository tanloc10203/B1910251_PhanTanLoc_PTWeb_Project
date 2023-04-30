<script>
import { computed, defineComponent, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { emptyObject } from "../../utils/functions";

export default defineComponent({
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const role = computed(
      () =>
        !emptyObject(store.state["auth"].user) && store.state["auth"].user.role
    );

    const linkPrivate = [
      ["mdi-inbox-arrow-down", "Người dùng", "/manager/dashboard"],
      ["mdi-send", "Quản lý danh mục", "/manager/category"],
      ["mdi-send", "Quản lý bài viết", "/manager/post"],
    ];

    const linkPublic = [["mdi-send", "Quản lý bài viết", "/manager/post"]];

    const links = computed(() =>
      role.value && role.value.toLowerCase() !== "admin"
        ? linkPublic
        : linkPrivate
    );

    const open = ref(false);

    watch(
      () => props.drawer,
      (drawer) => {
        open.value = drawer;
      }
    );

    return { links, open };
  },
});
</script>

<template>
  <v-navigation-drawer v-model="open" temporary>
    <v-list-item v-for="[icon, text, to] in links" :key="icon" link :to="to">
      <template v-slot:prepend>
        <v-icon>{{ icon }}</v-icon>
      </template>

      <v-list-item-title> {{ text }} </v-list-item-title>
    </v-list-item>
  </v-navigation-drawer>
</template>
