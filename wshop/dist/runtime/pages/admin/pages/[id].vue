<template>
  <div class="h-screen flex flex-col">
    <PageEditorHeader v-model:title="page.title" v-model:slug="page.slug" @save="savePage" />
    <div class="flex-grow flex overflow-hidden">
      <BlocksPalette @add-block="addBlock" />
      <PageCanvas v-model="page.content" :selected-block-index="selectedBlockIndex" @select-block="selectBlock" />
      <div class="w-[350px] flex-shrink-0 overflow-y-auto bg-gray-50">
          <PropsInspector :selected-block="selectedBlock || void 0" @update-prop="updateProp" />
          <SeoEditor 
            :title="page.title" 
            :slug="page.slug" 
            v-model:metaTitle="metaTitle" 
            v-model:metaDescription="metaDescription" 
          />
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "#imports";
import PageEditorHeader from "~/components/admin/pages/PageEditorHeader.vue";
import BlocksPalette from "~/components/admin/pages/BlocksPalette.vue";
import PageCanvas from "~/components/admin/pages/PageCanvas.vue";
import PropsInspector from "~/components/admin/pages/PropsInspector.vue";
import SeoEditor from "~/components/admin/pages/SeoEditor.vue";
const route = useRoute();
const router = useRouter();
const pageId = route.params.id;
const isNew = pageId === "new";
const page = ref({
  title: "New Page",
  slug: "",
  content: [],
  metaTitle: "",
  metaDescription: ""
});
const availableBlocks = [
  { type: "Heading", name: "Heading", defaultProps: { text: "New Heading", level: 1 } },
  { type: "Paragraph", name: "Paragraph", defaultProps: { text: "Some paragraph text." } },
  { type: "Button", name: "Button", defaultProps: { text: "Click me", href: "#" } }
];
const selectedBlockIndex = ref(null);
const selectedBlock = computed(() => selectedBlockIndex.value !== null && selectedBlockIndex.value < page.value.content.length ? page.value.content[selectedBlockIndex.value] : null);
const metaTitle = computed({
  get: () => page.value.metaTitle || "",
  set: (value) => {
    page.value.metaTitle = value;
  }
});
const metaDescription = computed({
  get: () => page.value.metaDescription || "",
  set: (value) => {
    page.value.metaDescription = value;
  }
});
const addBlock = (type) => {
  const block = availableBlocks.find((b) => b.type === type);
  if (block) {
    page.value.content.push({
      id: crypto.randomUUID(),
      type: block.type,
      props: { ...block.defaultProps }
    });
  }
};
const selectBlock = (index) => {
  selectedBlockIndex.value = index;
};
const updateProp = ({ key, value }) => {
  if (selectedBlock.value) {
    selectedBlock.value.props[key] = value;
  }
};
onMounted(async () => {
  if (!isNew) {
    try {
      const data = await $fetch(`/api/pages/${pageId}`);
      if (data) {
        page.value = data;
      }
    } catch (error) {
      console.error("Failed to fetch page data:", error);
    }
  }
});
const savePage = async () => {
  try {
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/pages" : `/api/pages/${pageId}`;
    await $fetch(url, { method, body: page.value });
    router.push("/admin/pages");
  } catch (error) {
    console.error("Failed to save page:", error);
  }
};
definePageMeta({ layout: "editor" });
</script>
