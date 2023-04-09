<script setup>
import { ref } from "vue";
import download from "@/lib/download.js";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Tree from "primevue/tree";
import "@/assets/themes/mytheme/theme.scss";

//firebase imports
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/main"; //firestore instance

const html = ref("");
const text = ref("");
const name = ref("Untitled Document");

async function createNotes() {
  alert("Hopefully adding to firebase");
  const notesRef = doc(collection(db, "notes"));
  await setDoc(
    notesRef,
    {
      //data to write to the document
      docName: name.value,
      textString: text.value,
      htmlString: html.value,
      timeStamp: serverTimestamp(),
    },
    { merge: true }
  );
}

let HTMLonly = false;
let MDonly = false;
const downloadItems = [
  {
    label: ".HTML Only",
    icon: "pi pi-download",
    command: () => {
      HTMLonly = true;
      initiateDownload();
      HTMLonly = false;
    },
  },
  {
    label: ".MD Only",
    icon: "pi pi-download",
    command: () => {
      MDonly = true;
      initiateDownload();
      MDonly = false;
    },
  },
];

function initiateDownload() {
  switch (true) {
    case HTMLonly:
      download(html.value, name.value, "html");
      break;
    case MDonly:
      download(text.value, name.value, "md");
      break;
    default:
      download(html.value, name.value, "html");
      download(text.value, name.value, "md");
      break;
  }
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
      saveStatus: false,
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
    <span class="p-buttonset">
      <Button
        label="New Document"
        icon="pi pi-file"
        @click="createNotes"
      ></Button>
      <SplitButton
        label="Download"
        icon="pi pi-download"
        @click="initiateDownload"
        :model="downloadItems"
      ></SplitButton>
    </span>

    <div>
      <Tree :value="nodes" class="treeFormat">
        <template #default="slotProps">
          <b>{{ slotProps.node.label }}</b>
        </template>
        <template #url="slotProps">
          <a :href="slotProps.node.data">{{ slotProps.node.label }}</a>
        </template>
      </Tree>

      <EditableDocument
        v-if="showEditableDocument"
        :renderText="showHTML"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
      ></EditableDocument>
    </div>

    <span class="p-buttonset">
      <Button @click="toggleHTMLView" label="Preview" icon="pi pi-eye"></Button>
      <Button
        @click="toggleDialog"
        label="Share"
        icon="pi pi-external-link"
      ></Button>
    </span>

    <Dialog position="center" v-model:visible="showShareDialog">
      <template #header>
        <h3 v-if="copyConfirmed">Link Copied! Click to Close</h3>
        <h3 v-else>Invite Others to View Your NoteDown</h3>
      </template>

      <LinkGenerator
        @shareableLink="(newLink) => (link = newLink)"
      ></LinkGenerator>

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
  </div>
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
.treeFormat {
  background-color: #e2d5ec;
  border-color: #e2d5ec;
}
</style>
