<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  ref,
  watch,
} from "@vue/runtime-core";
import slugify from "slugify";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import uploadApi from "../../../api/uploadApi";
import { emptyObject } from "../../../utils/functions";
import CKEditorCustom from "./CKEditorCustom.vue";

export default defineComponent({
  props: {
    isAddMode: {
      type: Boolean,
    },
    postSelected: {
      type: Object,
      default: {},
    },
  },
  components: {
    CKEditorCustom,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const title = ref("");
    const slug = ref("");
    const categoryId = ref("");
    const editorData = ref("");
    const categorySubId = ref("");
    const detailText = ref("");
    const loading = ref(false);

    const image = ref(undefined);
    const imageUrl = ref("");

    let errors = {};
    const max = 200;
    const countDetailText = 400;
    const ruleTitle = [
      (v) => !!v || "Tên tiêu đề là trường bắt buộc",
      (v) =>
        (v && v.length <= max) || `Tên tiêu đề không vượt quá ${max} kí tự`,
      (v) => (v && v.length >= 20) || `Tên tiêu đề ít nhất ${20} kí tự`,
    ];
    const ruleImage = [
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < 2000000 ||
          "Kích thước của ảnh nhỏ hơn 2 MB!"
        );
      },
    ];
    const ruleDetailText = [
      (v) => !!v || "Tên tiêu đề là trường bắt buộc",
      (v) =>
        (v && v.length <= countDetailText) ||
        `Giới thiệu không vượt quá ${countDetailText} kí tự`,
      (v) => (v && v.length >= 30) || `Ít nhất ít nhất ${30} kí tự`,
    ];
    const URL = computed(() => process.env.VUE_APP_ENDPOINT_URL);

    watch(
      () => props.postSelected,
      (post) => {
        if (post) {
          title.value = post.title;
          slug.value = slugify(post.title, { locale: "vi" });
          imageUrl.value = `${URL.value}/${post.image_title}`;
          editorData.value = post.detail_html;
          detailText.value = post.detail_text;

          if (post?.category_id.parent_id) {
            categoryId.value = post?.category_id.parent_id;

            store.dispatch("category/fetchAllCategory", {
              page: 1,
              limit: 100,
              where: `parent_id,${post?.category_id.parent_id}`,
            });

            categorySubId.value = post?.category_id._id;
          } else {
            categoryId.value = post?.category_id._id;
          }
        }
      }
    );

    watch(
      [categoryId, title, editorData, detailText],
      ([categoryId, titleNew, editorData, detailText]) => {
        !categoryId ? (errors["categoryId"] = true) : (errors = {});

        slug.value = slugify(titleNew, { locale: "vi" });
        titleNew.length >= max ? (errors["title"] = true) : (errors = {});

        !editorData ? (errors["editorData"] = true) : (errors = {});

        !detailText ? (errors["detailText"] = true) : (errors = {});
      }
    );

    const onChangeSelect = (value) => {
      if (!value) {
        store.dispatch("category/changeSubCategory", []);
        return;
      }

      categorySubId.value = "";

      store.dispatch("category/fetchAllCategory", {
        page: 1,
        limit: 100,
        where: `parent_id,${value}`,
      });
    };

    const user = computed(() => store.state["auth"].user);

    const categories = computed(() => [
      { _id: "", name: "Vui lòng chọn danh mục" },
      ...store.state["category"].categories,
    ]);

    const categorySub = computed(() => {
      return [
        { _id: "", name: "Vui lòng chọn danh mục con" },
        ...store.state.category.categorySub,
      ];
    });

    const isExistCategorySub = computed(() => categorySub.value.length > 1);

    onBeforeMount(() => {
      store.dispatch("category/fetchAllCategory", {
        page: 1,
        limit: 100,
        where: "level,1",
      });
    });

    const handleSubmit = async () => {
      if (emptyObject(errors)) {
        loading.value = true;

        let data = {
          title: title.value,
          slug: slug.value,
          categoryId: categoryId.value,
          userId: user.value._id,
          detail_html: editorData.value,
          detail_text: detailText.value,
        };

        if (image.value) {
          // * trước khi tạo bài viết phải upload ảnh lên server trước.
          const resImg = await uploadApi.image(image.value[0]);
          data = {
            ...data,
            image_title: resImg?.filename,
          };
        }

        if (categorySubId.value) {
          data = {
            ...data,
            categoryId: categorySubId.value,
          };
        }

        if (props.isAddMode) {
          // * Call api save post
          store
            .dispatch("post/fetchCreatePost", data)
            .then((value) => {
              if (value) {
                loading.value = false;
                router.push("/manager/post");
              }
            })
            .catch((_) => (loading.value = false));
        } else {
          store
            .dispatch("post/fetchUpdatePost", {
              id: props.postSelected._id,
              data,
            })
            .then((value) => {
              if (value) {
                loading.value = false;
                router.push("/manager/post");
              }
            })
            .catch((_) => (loading.value = false));
        }
      }
    };

    const onChangeEditor = (value) => {
      editorData.value = value;
    };

    const createImage = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        imageUrl.value = e.target.result;
      };

      reader.readAsDataURL(file);
    };

    const onFileChange = (files) => {
      if (!files[0]) {
        imageUrl.value = "";
        return;
      }

      createImage(files[0]);
    };

    return {
      ruleDetailText,
      countDetailText,
      detailText,
      title,
      ruleTitle,
      max,
      slug,
      categoryId,
      categories,
      isAddMode: props.isAddMode,
      editorData,
      isExistCategorySub,
      categorySubId,
      categorySub,
      image,
      ruleImage,
      imageUrl,
      loading,
      onFileChange,
      handleSubmit,
      onChangeEditor,
      onChangeSelect,
    };
  },
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-text-field
          type="text"
          label="Tiêu đề bài viết"
          v-model="title"
          :counter="max"
          :rules="ruleTitle"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="slug"
          type="text"
          label="Slug danh mục"
          disabled
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          :rules="ruleDetailText"
          :counter="countDetailText"
          v-model="detailText"
          type="text"
          label="Giới thiệu"
        />
      </v-col>

      <v-col cols="12" md="6" sm="12" xs="12">
        <v-select
          v-model="categoryId"
          label="Danh mục"
          :items="categories"
          item-title="name"
          item-value="_id"
          @update:modelValue="onChangeSelect"
        />
      </v-col>
      <v-col cols="12" md="6" sm="12" xs="12">
        <v-select
          v-if="isExistCategorySub"
          v-model="categorySubId"
          label="Danh mục con"
          :items="categorySub"
          item-title="name"
          item-value="_id"
        />
      </v-col>

      <v-col v-if="imageUrl" cols="12" sm="12" justify="center">
        <v-sheet
          class="rounded p-2 mx-auto"
          max-width="500"
          elevation="12"
          height="100%"
          width="100%"
        >
          <v-img :src="imageUrl" />
        </v-sheet>
      </v-col>

      <v-col cols="12">
        <v-file-input
          accept="image/png, image/jpeg, image/bmp"
          v-model="image"
          label="Ảnh tiêu đề"
          @update:modelValue="onFileChange"
          :rules="ruleImage"
        />
      </v-col>

      <v-col cols="12">
        <CKEditorCustom
          :editorData="editorData"
          @update:modelValue="onChangeEditor"
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          color="info"
          type="submit"
          :loading="loading"
          :disabled="
            !title ||
            !categoryId ||
            !editorData ||
            !imageUrl ||
            !detailText ||
            (isExistCategorySub && !categorySubId) ||
            loading
          "
        >
          {{ isAddMode ? "Tạo Bài Viết" : "Lưu Bài Viết" }}
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
