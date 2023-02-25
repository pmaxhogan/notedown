<script setup>
import Button from "primevue/button";
import { ref, watchEffect } from "vue";

const str = String.raw`
# Markdown Test!
\\(\text{M}\alpha\text{thjax Test}\\)
`;

const output = ref("");

watchEffect(() => {
  console.log("watchEffect");
  output.value = window.DOMPurify.sanitize(window.marked.parse(str));
});

// call mathjax typeset after the output is rendered
window.requestAnimationFrame(() => {
  window.MathJax.typeset();
});

const onClick = () => alert("click");
</script>

<template>
  <div class="markdown">
    <div v-html="output"></div>
    <Button @click="onClick">Click me!</Button>
  </div>
</template>
