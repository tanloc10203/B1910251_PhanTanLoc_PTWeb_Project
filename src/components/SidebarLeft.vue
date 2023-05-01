<script>
import { computed, defineComponent, inject, ref, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const open = ref(false);

    const categories = computed(() => store.state["category"].categories);

    watch(
      () => props.drawer,
      (drawer) => {
        open.value = drawer;
      }
    );

    const updateDrawer = inject("updateDrawer");

    return {
      updateDrawer,
      categories,
      open,
    };
  },
});
</script>

<template>
  <v-navigation-drawer v-model="open" temporary width="350">
    <v-list-item
      v-for="category in categories"
      :key="category._id"
      link
      @click="updateDrawer"
    >
      <router-link
        :to="`/category/${category.slug}`"
        class="d-block text-decoration-none"
      >
        <v-list-item-title> {{ category.name }} </v-list-item-title>
      </router-link>

      <!-- Sub Category -->
      <div v-if="category?.childrens && category?.childrens.length > 0">
        <v-list-item
          v-for="subCat in category.childrens"
          :key="subCat._id"
          link
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-minus" size="x-small"></v-icon>
          </template>
          <router-link
            :to="`/category/${subCat.slug}`"
            class="d-block text-decoration-none"
          >
            <v-list-item-title> {{ subCat.name }} </v-list-item-title>

            <!-- Sub sub Category -->
            <div v-if="subCat?.childrens && subCat?.childrens.length > 0">
              <v-list-item
                v-for="subSubCat in subCat.childrens"
                :key="subSubCat._id"
                link
                @click="updateDrawer"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-plus" size="x-small"></v-icon>
                </template>

                <router-link
                  :to="`/category/${subSubCat.slug}`"
                  class="d-block text-decoration-none"
                >
                  <v-list-item-title>
                    {{ subSubCat.name }}
                  </v-list-item-title>
                </router-link>
              </v-list-item>
            </div>
            <!-- End Sub sub category -->
          </router-link>
        </v-list-item>
      </div>
      <!-- End Sub category -->
    </v-list-item>
  </v-navigation-drawer>
</template>
