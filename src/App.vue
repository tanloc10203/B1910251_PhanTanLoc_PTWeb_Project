<script>
import { computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";
import Toast from "./components/Toast.vue";

export default defineComponent({
  components: {
    Toast,
  },
  setup() {
    const store = useStore();
    const text = computed(() => store.state["toast"].text);
    const open = computed(() => store.state["toast"].open);
    const color = computed(() => store.state["toast"].color);
    const duration = computed(() => store.state["toast"].timeout);

    watch(
      () => store.state["toast"].open,
      (open) => {
        if (open) {
          setTimeout(
            () => store.dispatch("toast/saveOpen", { open: false }),
            duration.value + 4
          );
        }
      }
    );

    return {
      text,
      open,
      color,
    };
  },
});
</script>

<template>
  <div>
    <router-view />

    <Toast v-if="open" :open="open" :color="color" :text="text" />
  </div>
</template>

<style>
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
