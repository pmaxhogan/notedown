<script setup>
import { ref } from "vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const str = ref(String.raw`
# Markdown Test!
\\(\text{M}\alpha\text{thjax Test}\\)
`.trim());
</script>

<script>
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
    <textarea v-model="str"></textarea>
    <MarkdownRenderer :content="str"></MarkdownRenderer>

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
textarea {
  width: 100%;
  height: 100px;
}
</style>
