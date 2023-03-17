<script setup>
import * as DOMPurify from "dompurify";
import { parse } from "marked";
import { ref, watchEffect } from "vue";

const sanitize = DOMPurify.default.sanitize;

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const MAX_CONTENT_LENGTH = 10 * 1000 * 1000;
if (props.content.length > MAX_CONTENT_LENGTH) {
  throw new Error("Content too long");
}

const output = ref("");

watchEffect(() => {
  output.value = sanitize(parse(props.content));
  window.requestAnimationFrame(() => {
    if (typeof window.MathJax !== "undefined") {
      // FIXME: testing does not work
      window.MathJax.typeset();
    }
  });
});
</script>

<template>
  <div v-html="output"></div>
</template>
