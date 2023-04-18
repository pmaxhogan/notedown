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
// eslint-disable-next-line prettier/prettier
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
          label: change.doc.data().docName,
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

const link = ref("");
const showShareDialog = ref(false);
const copyConfirmed = ref(false);
const showEditableDocument = ref(false);
const showHTML = ref(false);
const HTMLonly = ref(false);
const MDonly = ref(false);
const showConfirmDialog = ref(false);
const deleteConfirmed = ref(false);
const clone = ref(null);
const currDocRef = ref("");
const html = ref("");
const text = ref("");
const name = ref("Untitled Document");

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

async function addToDatabase() {
  currDocRef.value = await createNewDocument(
    name.value,
    text.value,
    html.value
  );
  console.log("Saved as new document with Document ID: ", currDocRef.value);
}

function updateInDatabase() {
  updateDocument(text.value, html.value, currDocRef.value);
  console.log("Changes written to Document ID: ", currDocRef.value);
}

function deleteInDatabase() {
  deleteDocument(currDocRef.value);
  console.log("Permanently deleted Document ID: ", currDocRef.value);
  deleteConfirmed.value = true;
}

function createNewCollection() {
  //call lib method that communicates with firebase
}

function copyToClipboard() {
  clone.value.focus();
  document.execCommand("copy");
  copyConfirmed.value = true;
}
</script>

<template>
  <div class="markdown">
    <div class="file-tree">
      <Tree :value="nodes" class="w-full md:w-30rem">
        <template #default="slotProps">
          <b>{{ slotProps.node.label }}</b>
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

    <div class="editable-area">
      <EditableDocument
        v-if="showEditableDocument"
        :renderText="showHTML"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
      ></EditableDocument>
    </div>

    <div class="buttons">
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
            showConfirmDialog = !showConfirmDialog;
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
    </div>

    <div class="dialogs">
      <Dialog position="center" v-model:visible="showConfirmDialog">
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
            @click="showConfirmDialog = !showConfirmDialog"
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
            @click="showConfirmDialog = !showConfirmDialog"
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
