<script setup>
const str = String.raw`
# Markdown Test!
\\(\text{M}\alpha\text{thjax Test}\\)
`;
const output = window.DOMPurify.sanitize(window.marked.parse(str));

// call mathjax typeset after the output is rendered
window.requestAnimationFrame(() => {
  window.MathJax.typeset();
});
</script>

<template>
  <div class="markdown">
    <div v-html="output"></div>
  </div>
</template>
