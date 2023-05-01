<script>
import { defineComponent, ref, watch, reactive } from "@vue/runtime-core";
import { useStore } from "vuex";
import authApi from "../api/authApi";
import { emptyObject } from "../utils/functions";
import OverlayCustom from "./OverlayCustom.vue";

export default defineComponent({
  components: {
    OverlayCustom,
  },
  setup() {
    const email = ref("");
    const fullName = ref("");
    const password = ref("");
    const loading = ref(false);
    const messageAlert = reactive({
      text: "",
      type: "",
    });
    const couterMaxPwd = 32;

    const emailRules = [
      (v) => !!v || "Email là trường bắt buộc",
      (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ",
    ];
    const passwordRules = [
      (v) => !!v || "Password là trường bắt buộc",
      (v) =>
        (v && v.length <= couterMaxPwd) ||
        `Mật khẩu không vượt quá ${couterMaxPwd} kí tự`,
      (v) => (v && v.length >= 4) || `Mật khẩu ít nhất ${4} kí tự`,
    ];

    let errors = {};
    const store = useStore();

    watch([email, fullName, password], ([email, fullName, password]) => {
      messageAlert.text = "";
      messageAlert.type = "";

      if (!/.+@.+\..+/.test(email)) {
        errors["email"] = true;
      } else {
        errors = {};
      }

      !fullName ? (errors["fullName"] = true) : (errors = {});

      if (!password || password.length > couterMaxPwd) {
        errors["password"] = true;
      } else {
        errors = {};
      }
    });

    const handleSubmit = async () => {
      try {
        if (emptyObject(errors)) {
          loading.value = true;

          const data = {
            email: email.value,
            full_name: fullName.value,
            password: password.value,
          };

          const response = await authApi.signUp(data);

          if (response) {
            const payload = {
              tinmeout: 3500,
              open: true,
              color: "success",
              text: "Đăng ký thành công vui lòng xác nhận email",
            };
            messageAlert.text =
              "Đăng ký thành công vui lòng xác nhận email của bạn.";
            messageAlert.type = "success";
            store.dispatch("toast/startToast", payload);

            loading.value = false;
          }
        }
      } catch (error) {
        loading.value = false;

        if (error.response) {
          const payload = {
            tinmeout: 20000,
            open: true,
            color: "error",
            text: error.response.data.errors.message,
          };
          messageAlert.text = error.response.data.errors.message;
          messageAlert.type = "error";
          store.dispatch("toast/startToast", payload);
        }
      }
    };

    const handleClickOutside = (value) => {
      console.log(value);
      loading.value = true;
    };

    return {
      email,
      emailRules,
      messageAlert,
      loading,
      errors,
      couterMaxPwd,
      fullName,
      passwordRules,
      password,
      handleClickOutside,
      handleSubmit,
    };
  },
});
</script>

<template>
  <v-row justify="center" align="center" style="min-height: 80vh">
    <v-col cols="6" align-self="center">
      <v-sheet class="pa-2 ma-2">
        <v-form @submit.prevent="handleSubmit" class="position-relative">
          <h1 class="mb-5">Đăng ký tài khoản</h1>

          <v-alert
            v-if="messageAlert.text"
            :type="messageAlert.type"
            class="mb-5"
          >
            {{ messageAlert.text }}
          </v-alert>

          <v-text-field v-model="fullName" label="Họ và tên" />

          <v-text-field v-model="email" label="E-mail" :rules="emailRules" />

          <v-text-field
            type="password"
            v-model="password"
            :counter="couterMaxPwd"
            label="Password"
            :rules="passwordRules"
          />

          <router-link to="/login">Đăng nhập</router-link>

          <v-btn
            color="info"
            type="submit"
            class="d-block mt-5"
            :loading="loading"
            :disabled="!email || !fullName || !password || loading"
          >
            Đăng ký
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>

          <overlay-custom :open="loading" />
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>
