<script>
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import authApi from "../api/authApi";
import { emptyObject } from "../utils/functions";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const drawer = ref(null);
    const theme = ref(localStorage.getItem("theme") || "light");

    const user = computed(() =>
      emptyObject(store.state.auth.user) ? null : store.state.auth.user
    );

    const accessToken = computed(() =>
      localStorage.getItem("accessToken") ? true : false
    );

    const isHome = computed(() => (!route.meta?.auth ? true : false));

    const handleLogout = async () => {
      try {
        const response = await authApi.signOut();
        if (response) {
          store.dispatch("auth/remove");
          router.push("/login");
        }
      } catch (error) {
        console.log("error handleLogout:::", error);
        throw new Error(error.message);
      }
    };

    onMounted(() => {
      if (isHome.value) {
        store.dispatch("category/fetchAllWtihChildrenCategory");
      }
    });

    watch(isHome, (isHome) => {
      if (isHome) {
        store.dispatch("category/fetchAllWtihChildrenCategory");
        store.dispatch("auth/saveUser", {});
      }
    });

    function onClick() {
      theme.value = theme.value === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme.value);
    }

    function updateDrawer() {
      drawer.value = false;
    }

    provide("updateDrawer", updateDrawer);

    return {
      onClick,
      handleLogout,
      updateDrawer,
      accessToken,
      theme,
      drawer,
      user,
      isHome,
    };
  },
});
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/">App News</router-link>
      </v-toolbar-title>

      <v-toolbar-title v-if="user"
        >Hello, {{ user && user.email }}</v-toolbar-title
      >

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        @click="onClick"
      >
      </v-btn>

      <v-btn v-if="isHome && accessToken" to="/manager" variant="flat">
        Quản trị
      </v-btn>

      <div v-else-if="!accessToken">
        <v-btn to="/login" variant="flat">Đăng nhập</v-btn>
        <v-btn to="/register" variant="flat">Đăng kí</v-btn>
      </div>

      <v-btn v-if="user" variant="flat" @click="handleLogout">
        Đăng xuất
      </v-btn>
    </v-app-bar>

    <router-view
      name="sidebar"
      :drawer="drawer"
      :update-drawer="updateDrawer"
    />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
