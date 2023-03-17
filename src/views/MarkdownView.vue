<script setup>
import { ref } from "vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import "@/assets/themes/mytheme/theme.scss";

const str = ref(
  String.raw`
# Markdown Test!
\\(\text{M}\alpha\text{thjax Test}\\)
`.trim()
);
</script>

<script>
export default {
  data() {
    return {
      link: "Goodbye World",
      display: false,
      copyConfirmed: false,
    };
  },
  methods: {
    copy() {
      this.$refs.clone.focus();
      document.execCommand("copy");
      this.copyConfirmed = true;
    },
    toggleDialog() {
      this.display = !this.display;
      this.copyConfirmed = false;
    },
  },
};
</script>

<template>
  <div class="markdown">
    <textarea v-model="str"></textarea>
    <MarkdownRenderer :content="str"></MarkdownRenderer>
    <Button
      @click="toggleDialog"
      label="Share"
      icon="pi pi-external-link"
    ></Button>

    <Dialog position="center" v-model:visible="display">
      <template #header>
        <h3 v-if="copyConfirmed">Link Copied! Click to Close</h3>
        <h3 v-else>Invite Others to View Your NoteDown</h3>
      </template>
      <textarea
        class="linkdisplay"
        v-on:focus="$event.target.select()"
        ref="clone"
        readonly
        :value="link"
      ></textarea>
      <template #footer>
        <Button
          v-if="copyConfirmed"
          @click="toggleDialog"
          label="Close"
          icon="pi pi-times"
        ></Button>
        <Button 
          v-else 
          @click="copy"
          label="Copy"
          icon="pi pi-link"
        ></Button>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss">
textarea {
  width: 100%;
  height: 100px;
}
.linkdisplay {
  width: 100%;
  height: 25px;
  border-radius: 5px;
  font-size: 16px;
  font-family: Roboto, sans-serif;
  background-color: #fff9fe;
  border-color: #fff9fe;
}
</style>
