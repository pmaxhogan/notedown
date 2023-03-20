<script setup>
import { ref } from "vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import EditableDocument from "@/components/EditableDocument.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
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
      showEditableDocument: false,
      savedDocuments: [],
      newDocumentName: "",
      savedFolders: [
        {
          name: "Default",
          documents: [],
        },
        {
          name: "Trash",
          documents: [],
        },
      ],
    };
  },
  components: {
    EditableDocument,
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
    toggleEditableDocument() {
      this.showEditableDocument = !this.showEditableDocument;
    },
    saveDocument() {
      if (this.newDocumentName) {
        this.savedDocuments.push({
          name: this.newDocumentName,
          content: this.str.value,
        });
        this.newDocumentName = "";
        this.showEditableDocument = false;
      } else {
        alert("Please enter a document name:");
      }
    },
    loadDocument(index) {
      this.str.value = this.savedDocuments[index].content;
    },
    createFolder(folderName) {
      this.savedFolders.push({ name: folderName, documents: [] });
    },
    addDocumentToFolder(folderName, document) {
      const folder = this.savedFolders.find((f) => f.name === folderName);
      if (folder) {
        folder.documents.push(document);
      } else {
        console.error("Folder not found:", folderName);
      }
    },
    getDocumentsInFolder(folderName) {
      const folder = this.savedFolders.find((f) => f.name === folderName);
      return folder ? folder.documents : [];
    },
    isValidDocumentName(name) {
      return /^[a-zA-Z0-9]/.test(name);
    },
  },
};
</script>

<template>
  <div class="markdown">
    <textarea v-model="str"></textarea>
    <MarkdownRenderer :content="str"></MarkdownRenderer>

    <div class="position-sticky mx-auto my-auto">
      <span class="p-buttonset">
        <Button
          class="mr-8"
          @click="toggleEditableDocument"
          label="Create/Edit Document"
          icon="pi pi-file"
        ></Button>
        <Button
          @click="saveDocument"
          label="Save Document"
          icon="pi pi-save"
        ></Button>
        <SplitButton
          @click="
            addDocumentToFolder(selectedFolder, {
              name: newDocumentName,
              content: str.value,
            })
          "
          label="Add to Folder"
          icon="pi pi-folder-open"
          :model="savedFolders"
        ></SplitButton>
      </span>
    </div>

    <div v-if="showEditableDocument">
      <textarea
        type="text"
        v-model="newDocumentName"
        placeholder="Document name"
      ></textarea>
      <EditableDocument :content="str" @update="onDocumentUpdate" />
      <select v-model="selectedFolder">
        <option
          v-for="(folder, index) in savedFolders"
          :key="index"
          :value="folder.name"
        >
          {{ folder.name }}
        </option>
      </select>
    </div>

    <h2>Folders</h2>
    <ul>
      <li v-for="(folder, index) in savedFolders" :key="index">
        {{ folder.name }}
      </li>
    </ul>

    <h2>Saved Documents</h2>
    <ul>
      <li v-for="(document, index) in savedDocuments" :key="index">
        <a href="#" @click.prevent="loadDocument(index)">{{ document.name }}</a>
      </li>
    </ul>
  </div>

  <div class="position-sticky bottom-0 end-0">
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
        <Button v-else @click="copy" label="Copy" icon="pi pi-link"></Button>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss">
textarea {
  width: 100%;
  height: 100px;
  background-color: #fff9fe;
  border-color: #fff9fe;
}
.linkdisplay {
  width: 100%;
  height: 25px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fff9fe;
  border-color: #fff9fe;
}
</style>
