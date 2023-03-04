<script setup>
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
</script>

<script>
import Button from "primevue/button";
import Dialog from "primevue/dialog";

export default {
  data() {
    return {
      text: "Goodbye World",
      display: false,
    };
  },
  methods: {
    copy() {
      this.$refs.clone.focus();
      document.execCommand("copy");
    },
    openDialog() {
      this.display = !this.display;
    },
  },
};
</script>

<template>
  <div class="markdown">
    <div v-html="output"></div>
    <Button @click="openDialog">Share</Button>
    <Dialog position="center" v-model:visible="display">
      <template #header>
        <h3>Invite Others to View Your NoteDown</h3>
      </template>
      <input
        v-on:focus="$event.target.select()"
        ref="clone"
        readonly
        :value="text"
      />
      <template #footer>
        <Button @click="copy" label="Share" icon="pi pi-link" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss">
//https://henryko.dev/2021/07/11/getting-started-with-primevue/#Customise_Primary_Colour_and_Font
</style>
