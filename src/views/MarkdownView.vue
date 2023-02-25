<script setup>
import Modal from "../components/Modal.vue";
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

// open or close dialog
const isModalVisible = ref(false);
function showModal() {
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
}

const onClick = () => alert("click");
</script>

<template>
  <div class="markdown">
    <div v-html="output"></div>
    <div id="app">
      <button type="button" class="btn" @click="showModal">Share</button>
      <Modal v-show="isModalVisible" @close="closeModal">
        <template v-slot:header> Invite Others to View Your NoteDown </template>
        <template v-slot:body></template>
      </Modal>
    </div>
    <Button @click="onClick">Click me!</Button>
  </div>
</template>
