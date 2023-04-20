<script setup>
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import { computed, ref, watchEffect } from "vue";

const emit = defineEmits(["html", "text", "name", "error"]);


const props = defineProps({
  renderText: {
    type: Boolean,
    required: true,
  },
  fileContent: {
    type: String,
    default: String.raw`
# Markdown Test!
\\(\text{M}\alpha\text{thjax Test}\\)
`.trim(),
  },
  fileName: {
    type: String,
    default: "Untitled Document",
  },
});

const contentToRender = ref(props.fileContent);

const documentName = ref(props.fileName);

const invalidDocumentName = computed(() => {
  const specialCharRegex = /^[!@#$%^&*(),.?":{}|<>]/;
  return (
    documentName.value.trim() === "" ||
    specialCharRegex.test(documentName.value)
  );
});

watchEffect(() => {
  emit("text", contentToRender.value);
  if (!invalidDocumentName.value) {
    emit("name", documentName.value);
  }
});
</script>

<template>
  <div>
    <textarea
      class="edit-filename"
      :class="{ 'invalid-name': invalidDocumentName }"
      type="text"
      placeholder="Untitled Document"
      required="required"
      v-model="documentName"
    ></textarea>
    <div v-if="invalidDocumentName" class="error-message">
      Document name should not be empty or start with a special character.
    </div>

    <textarea
      class="editable-area"
      type="text"
      placeholder="Start Typing!"
      v-model="contentToRender"
    ></textarea>

    <MarkdownRenderer
      v-show="props?.renderText"
      :content="contentToRender"
      @html="emit('html', $event)"
      @error="emit('error', $event)"
    ></MarkdownRenderer>
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

.invalid-name {
  border-color: #f14668;
}

.error-message {
  color: #f14668;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
