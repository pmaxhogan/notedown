<!--CreateFile.vue uses file-saver to save text into HTML files-->
<script setup>
import { saveAs } from "file-saver";

const props = defineProps({
  docname: {
    type: String,
    required: true,
  },
  textToSave: {
    type: String,
    required: true,
  },
  startDownload: {
    type: Boolean,
    required: true,
    default: false,
  },
});

function GenerateHTML() {
  const blob = new Blob([props.textToSave], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, props.docname + ".html");
}
</script>

<template>
  <button v-if="startDownload" type="submit" @click="GenerateHTML">Download</button>
</template>
