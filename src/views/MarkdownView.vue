<script setup>
import { ref } from "vue";
import download from "@/lib/download.js";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import "@/assets/themes/mytheme/theme.scss";

const html = ref("");
const text = ref("");
const name = ref("");

function initiateDownload() {
  download(text.value, name.value, "md");
  download(html.value, name.value, "html");
}
</script>

<script>
import EditableDocument from "@/components/EditableDocument.vue";
import LinkGenerator from "@/components/LinkGenerator.vue";

export default {
  data() {
    return {
      link: "",
      showShareDialog: false,
      copyConfirmed: false,
      showEditableDocument: false,
      showHTML: false,
      download: false,
    };
  },
  components: {
    EditableDocument,
    LinkGenerator,
  },

  methods: {
    copy() {
      this.$refs.clone.focus();
      document.execCommand("copy");
      this.copyConfirmed = true;
    },
    captureLink(sl) {
      this.link = sl;
    },
    toggleDialog() {
      this.showShareDialog = !this.showShareDialog;
      this.copyConfirmed = false;
    },
    toggleEditableDocument() {
      this.showEditableDocument = !this.showEditableDocument;
    },
    toggleHTMLView() {
      this.showHTML = !this.showHTML;
    },
  },
};
</script>

<template>
  <div class="markdown">
    <div>
      <EditableDocument
        v-if="showEditableDocument"
        :renderText="showHTML"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
      ></EditableDocument>

      <span class="p-buttonset">
        <Button
          @click="toggleEditableDocument"
          label="Create"
          icon="pi pi-file"
        ></Button>
        <Button
          @click="toggleHTMLView"
          label="Preview"
          icon="pi pi-eye"
        ></Button>
        <Button
          @click="initiateDownload"
          label="Download"
          icon="pi pi-download"
        ></Button>
        <Button
          @click="toggleDialog"
          label="Share"
          icon="pi pi-external-link"
        ></Button>
      </span>
    </div>
  </div>

  <Dialog position="center" v-model:visible="showShareDialog">
    <template #header>
      <h3 v-if="copyConfirmed">Link Copied! Click to Close</h3>
      <h3 v-else>Invite Others to View Your NoteDown</h3>
    </template>

    <LinkGenerator @shareableLink="captureLink"></LinkGenerator>

    <textarea
      v-if="!copyConfirmed"
      class="displayLinkArea"
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
      <Button v-else @click="copy" label="Copy" icon="pi pi-link"></Button>
    </template>
  </Dialog>
</template>

<style lang="scss">
textarea {
  width: 100%;
  height: 100px;
  background-color: #fff9fe;
  border-color: #fff9fe;
}
.displayLinkArea {
  width: 100%;
  height: 25px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fff9fe;
  border-color: #fff9fe;
}
</style>
