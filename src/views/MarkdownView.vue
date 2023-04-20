<script setup>
import { computed, ref } from "vue";

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
import { useCollection, useCurrentUser } from "vuefire";
import { collection } from "firebase/firestore";
import { db } from "@/main";
import router from "@/router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const toast = useToast();
//firestore instance

//toggle displays
const showShareDialog = ref(false);
const copyConfirmed = ref(false);
const showDeleteDialog = ref(false);
const deleteConfirmed = ref(false);
const showHTML = ref(false);
const showEditableArea = ref(false);

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
const name = ref(""); //document name

//reference to the subcollection
const cRef = useCollection(
  collection(db, "users/" + useCurrentUser()?.value?.uid + "/docs")
);

const nodes = ref([
  {
    key: "0",
    label: "Default",
    icon: "pi pi-folder",
    children: [],
  },
]);

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

//opens selected document in EditableDocument
const editDocument = (node) => {
  if (node.key != "Default") {
    showEditableArea.value = true;

    //update file text, file name, and document ID
    text.value = node.currText;
    name.value = node.label;
    currDocRef.value = node.key;
  }
};

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
      showEditableArea.value = true;
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
  updateDocument(name.value, text.value, html.value, currDocRef.value);
  console.log("Changes written to Document ID: ", currDocRef.value);
}

//permanently delete document
function deleteInDatabase() {
  deleteDocument(currDocRef.value);
  console.log("Permanently deleted Document ID: ", currDocRef.value);
  deleteConfirmed.value = true;
}

//create new folder
function createNewCollection() {}

//move document into a new folder
function moveIntoFolder() {
  //display dialog with folders from a drop down menu
  //containing list of current folders
  //have user select a folder from the menu
  //update nodes???
}

//copy text to clipboard
function copyToClipboard() {
  clone.value.focus();
  document.execCommand("copy");
  copyConfirmed.value = true;
}

const showError = () => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: "Content too long",
    life: 3000,
  });
};
</script>

<template>
  <div class="markdown">
    <div>
      <Tree :value="nodes" class="w-full md:w-30rem">
        <template #default="slotProps">
          <span
            v-tooltip.bottom="{
              value: `Click to Edit Document`,
              escape: true,
              class: 'custom-message',
            }"
            >{{ slotProps.node.label }}</span
          >
          <Button
            v-if="slotProps.node.data"
            v-tooltip.bottom="{
              value: `Preview`,
              escape: true,
              class: 'custom-message',
            }"
            class="p-button-rounded p-button-text p-button-plain"
            icon="pi pi-eye"
            @click="
              () =>
                router.push(
                  '/viewdoc/' +
                    useCurrentUser()?.value?.uid +
                    '/' +
                    slotProps.node.key
                )
            "
          ></Button>
          <Button
            v-if="slotProps.node.data"
            v-tooltip.bottom="{
              value: `Move to Folder`,
              escape: true,
              class: 'custom-message',
            }"
            class="p-button-rounded p-button-text p-button-plain"
            icon="pi pi-folder-open"
            @click="moveIntoFolder"
          ></Button>
        </template>
      </Tree>
    </div>

    <span class="p-buttonset">
      <Button
        label="Create"
        icon="pi pi-file"
        @click="
          this.showEditableDocument = !this.showEditableDocument;
          currDocRef = '';
        "
      ></Button>
    </span>

    <div>
      <EditableDocument
        v-if="this.showEditableDocument"
        :renderText="showHTML"
        :fileContent="text"
        :fileName="name"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
        @error="showError"
      ></EditableDocument>

    <span class="p-buttonset" v-if="this.showEditableDocument">
      <Button
        label="Save as New"
        icon="pi pi-file"
        @click="addToDatabase"
      ></Button>
      <Button
        :disabled="!currDocRef"
        icon="pi pi-file"
        label="Save"
        @click="updateInDatabase"
      ></Button>
      <Button
        :disabled="!currDocRef"
        label="Delete"
        icon="pi pi-trash"
        @click="deleteInDatabase"
      ></Button>
      <SplitButton
        label="Download"
        icon="pi pi-download"
        @click="initiateDownload"
        :model="downloadItems"
      ></SplitButton>
      <Button
        label="Preview"
        icon="pi pi-eye"
        @click="this.showHTML = !this.showHTML"
      ></Button>
      <Button
        :disabled="!currDocRef"
        label="Share"
        icon="pi pi-external-link"
        @click="
          this.showShareDialog = !this.showShareDialog;
          this.copyConfirmed = false;
        "
      ></Button>
    </span>

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
            showShareDialog = false;
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
    <Toast ref="toast" />
  </div>
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
.editDoc{
  display: none;
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
