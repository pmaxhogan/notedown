<script setup>
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import { ref } from "vue";
import CreateFile from "@/components/CreateFile.vue";

const contentToRender = ref(String.raw``.trim());
const documentName = ref("");
const props = defineProps({
  renderText: {
    type: Boolean,
    required: true,
  },
  downloadConfirm: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div>
    <textarea
      class="edit-filename"
      type="text"
      placeholder="Enter Document Name"
      required="true"
      v-model="documentName"
    ></textarea>

    <textarea
      class="editable-area"
      type="text"
      placeholder="Start Typing!"
      v-model="contentToRender"
    ></textarea>

    <MarkdownRenderer
      v-if="props.renderText"
      :content="contentToRender"
    ></MarkdownRenderer>

    <CreateFile
      :docname="documentName"
      :textToSave="contentToRender"
      :startDownload="downloadConfirm"
    ></CreateFile>
  </div>
</template>

<style scoped>
.edit-filename {
  max-height: 25px;
  padding: 0.1rem;
  padding-left: 1rem;
  resize: none;
}
.editable-area {
  min-height: 200px;
  resize: vertical;
  padding: 1rem;
}
.edit-filename,
.editable-area {
  border-radius: 4px;
  border-color: #e2d5ec;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #fff9fe;
  color: #000000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
