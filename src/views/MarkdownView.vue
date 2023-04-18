<script setup>
import { onMounted, ref } from "vue";

//style imports
import "@/assets/themes/mytheme/theme.scss";

//Database Helper Functions
import download from "@/lib/download.js";
import createNewDocument from "@/lib/createNewDocument.js";
import updateDocument from "@/lib/updateDocument.js";
import deleteDocument from "@/lib/deleteDocument.js";

//Vue components
import EditableDocument from "@/components/EditableDocument.vue";
import LinkGenerator from "@/components/LinkGenerator.vue";

//PrimeVue Components
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Tree from "primevue/tree";

//firestore imports
import { useCurrentUser } from "vuefire";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/main"; //firestore instance

//Reactive array to hold folder tree nodes
const nodes = ref([
  {
    key: "0",
    label: "Default",
    icon: "pi pi-folder",
    children: [],
  },
]);

//listens to changes in firebase collections
onMounted(() => {
  //reference to the subcollection
  const cRef = collection(
    db,
    "users/" + useCurrentUser()?.value?.uid + "/docs"
  );

  //sorts the documents in subcollection in order of creation/update
  const q = query(cRef, orderBy("timeStamp", "asc"));

  //listen for changes to documents in a collection
  onSnapshot(q, (snapshot) => {
    //loop through collection to identify changes then push changes as new tree nodes
    snapshot.docChanges().forEach((change) => {
      //push change onto stack
      if (change.type === "added") {
        nodes.value[0].children.push({
          key: change.doc.id,
          icon: "pi pi-file",
          label: change.doc.data().docName,
          data: change.doc.data().docURL,
          type: "url",
        });
      }
      //pop change from stack
      if (change.type === "removed") {
        nodes.value[0].children.pop();
      }
      console.log(nodes.value[0].children);
    });
  });
});

//toggle displays
const showShareDialog = ref(false);
const copyConfirmed = ref(false);
const showDeleteDialog = ref(false);
const deleteConfirmed = ref(false);
const showHTML = ref(false); //toggle HTML preview
const showEditableDocument = ref(false); //toggle editable area

//specify download format
const HTMLonly = ref(false);
const MDonly = ref(false);

//link share, copy to clipboard
const clone = ref(null);
const link = ref("");

//document, folder references
const currDocRef = ref("");

//user inputs
const html = ref(""); //HTML rendered string
const text = ref(""); //plaintext string
const name = ref("Untitled Document"); //document name

//actions for document download
const downloadItems = [
  {
    label: ".HTML Only",
    icon: "pi pi-download",
    command: () => {
      HTMLonly.value = true;
      initiateDownload();
      HTMLonly.value = false;
    },
  },
  {
    label: ".MD Only",
    icon: "pi pi-download",
    command: () => {
      MDonly.value = true;
      initiateDownload();
      MDonly.value = false;
    },
  },
];

//actions for create new...
const newButtonItems = [
  {
    label: "New Document",
    icon: "pi pi-file",
    command: () => {
      showEditableDocument.value = !showEditableDocument.value;
      currDocRef.value = "";
    },
  },
  {
    label: "New Folder",
    icon: "pi pi-folder",
    //remove this line once folder creation is setup
    disabled: true,
    command: () => {
      createNewCollection();
      //need to add const variable to hold the new folder name.
    },
  },
];

//downloads document based on format specified
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

//save as new document in database
async function addToDatabase() {
  currDocRef.value = await createNewDocument(
    name.value,
    text.value,
    html.value
  );
  console.log("Saved as new document with Document ID: ", currDocRef.value);
}

//save changes to document
function updateInDatabase() {
  updateDocument(text.value, html.value, currDocRef.value);
  console.log("Changes written to Document ID: ", currDocRef.value);
}

//permanently delete document
function deleteInDatabase() {
  deleteDocument(currDocRef.value);
  console.log("Permanently deleted Document ID: ", currDocRef.value);
  deleteConfirmed.value = true;
}

//create new folder
function createNewCollection() {
  //call lib method that communicates with firebase
}

//copy text to clipboard
function copyToClipboard() {
  clone.value.focus();
  document.execCommand("copy");
  copyConfirmed.value = true;
}
</script>

<template>
  <div class="markdown">
    <div class="file-tree">
      <Tree
        :value="nodes"
        class="w-full md:w-30rem"
        selectionMode="single"
        :loading="loading"
      >
        <template #default="slotProps">
          <b>{{ slotProps.node.label }}</b>
        </template>
        <template #url="slotProps">
          <a :href="slotProps.node.data">{{ slotProps.node.label }}</a>
        </template>
      </Tree>
    </div>

    <SplitButton
      v-tooltip.bottom="{
        value: `Select from Dropdown`,
        escape: true,
        class: 'custom-message',
      }"
      label="New"
      icon="pi pi-plus"
      @click="newButtonItems[0].command"
      :model="newButtonItems"
    ></SplitButton>

    <EditableDocument
      v-if="showEditableDocument"
      :renderText="showHTML"
      @html="(newHtml) => (html = newHtml)"
      @name="(newName) => (name = newName)"
      @text="(newText) => (text = newText)"
    ></EditableDocument>

    <span class="p-buttonset" v-if="showEditableDocument">
      <Button
        v-tooltip.bottom="{
          value: `Preview`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-eye"
        @click="showHTML = !showHTML"
      ></Button>
      <Button
        v-tooltip.bottom="{
          value: `Save as New`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-save"
        @click="addToDatabase"
      ></Button>
      <Button
        :disabled="!currDocRef"
        v-tooltip.bottom="{
          value: `Save`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-cloud-upload"
        @click="updateInDatabase"
      ></Button>
      <Button
        :disabled="!currDocRef"
        v-tooltip.bottom="{
          value: `Delete`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-trash"
        @click="
          showDeleteDialog = !showDeleteDialog;
          deleteConfirmed = false;
        "
      ></Button>
      <Button
        v-tooltip.bottom="{
          value: `Share`,
          escape: true,
          class: 'custom-message',
        }"
        :disabled="!currDocRef"
        icon="pi pi-link"
        @click="
          showShareDialog = !showShareDialog;
          copyConfirmed = false;
        "
      ></Button>
      <SplitButton
        v-tooltip.bottom="{
          value: `Download`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-download"
        @click="initiateDownload"
        :model="downloadItems"
      ></SplitButton>
    </span>

    <Dialog position="center" v-model:visible="showDeleteDialog">
      <template #header>
        <h3 v-if="deleteConfirmed">
          Document Permanently Deleted. Click to Close
        </h3>
        <h3 v-else>Are you sure?</h3>
      </template>
      <p v-if="!deleteConfirmed">
        This action will permanently delete the document.
      </p>
      <template #footer>
        <Button
          v-if="!deleteConfirmed"
          label="No"
          icon="pi pi-times"
          @click="showDeleteDialog = !showDeleteDialog"
        ></Button>
        <Button
          v-if="!deleteConfirmed"
          label="Delete"
          icon="pi pi-trash"
          @click="deleteInDatabase"
        ></Button>
        <Button
          v-else
          label="Close"
          icon="pi pi-times"
          @click="
            showDeleteDialog = !showDeleteDialog;
            showEditableDocument = !showEditableDocument;
          "
        ></Button>
      </template>
    </Dialog>

    <Dialog position="center" v-model:visible="showShareDialog">
      <template #header>
        <h3 v-if="copyConfirmed">Link Copied! Click to Close</h3>
        <h3 v-else>Invite Others to View Your NoteDown</h3>
      </template>
      <LinkGenerator
        @shareableLink="(newLink) => (link = newLink)"
        :docId="currDocRef"
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
          @click="
            showShareDialog = !showShareDialog;
            copyConfirmed = false;
          "
          label="Close"
          icon="pi pi-times"
        ></Button>
        <Button
          v-else
          @click="copyToClipboard"
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
.custom-message .p-tooltip-text {
  background-color: #e2d5ec;
  color: #000000;
  font-size: 11px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>
