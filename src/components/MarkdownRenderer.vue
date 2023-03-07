<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const output = ref("");

watchEffect(() => {
  output.value = window.DOMPurify.sanitize(window.marked.parse(props.content));
  window.requestAnimationFrame(() => {
    window.MathJax.typeset();
  });
});
</script>

<template>
  <div v-html="output"></div>
</template>
