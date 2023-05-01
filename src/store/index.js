import { createStore } from "vuex";
import auth from "./modules/auth";
import category from "./modules/category";
import toast from "./modules/toast";
import post from "./modules/post";
import chat from "./modules/chat";

export default createStore({
  modules: {
    auth,
    category,
    toast,
    post,
    chat,
  },
  devtools: process.env.NODE_ENV !== "production",
});
