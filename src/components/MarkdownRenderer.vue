<script setup>
import * as DOMPurify from "dompurify";
import { parse } from "marked";
import { ref, watch } from "vue";

const emit = defineEmits(["html", "error"]);

const sanitize = DOMPurify.default.sanitize;

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const MAX_CONTENT_LENGTH = 1000;
watch(
  () => props.content,
  () => {
    if (props.content.length > MAX_CONTENT_LENGTH) {
      emit("error", "Content too long");
    }
  }
);
if (props.content.length > MAX_CONTENT_LENGTH) {
  emit("error", "Content too long");
}

const output = ref("");

watch(() => props.content, update);

function update() {
  output.value = sanitize(parse(props.content));
  emit("html", output.value);
  window.requestAnimationFrame(() => {
    if (typeof window.MathJax !== "undefined") {
      // FIXME: testing does not work
      window.MathJax.typeset();
    }
  });
}
update();
</script>

<template>
  <div v-html="output"></div>
</template>
