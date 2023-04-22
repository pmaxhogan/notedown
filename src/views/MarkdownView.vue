<script setup>
import { computed, ref } from "vue";

//style imports
import "@/assets/themes/mytheme/theme.scss";

//Database Helper Functions
import download from "@/lib/download.js";
import createNewDocument from "@/lib/createNewDocument.js";
import updateDocument from "@/lib/updateDocument.js";
import deleteDocument from "@/lib/deleteDocument.js";
import createFolder from "@/lib/createFolder.js";
import renameFolder from "@/lib/renameFolder.js";
import deleteFolder from "@/lib/deleteFolder.js";

//Vue components
import EditableDocument from "@/components/EditableDocument.vue";
import LinkGenerator from "@/components/LinkGenerator.vue";

//PrimeVue Components
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Tree from "primevue/tree";
import InputText from "primevue/inputtext";

//firestore imports
import { useCollection, useCurrentUser } from "vuefire";
import { collection } from "firebase/firestore";
import { db } from "@/main";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import awaitSignedIn from "@/lib/awaitSignedIn";

const toast = useToast();

//toggle displays
const showShareDialog = ref(false);
const copyConfirmed = ref(false);
const showDeleteDialog = ref(false);
const deleteConfirmed = ref(false);
const showHTML = ref(false);
const showEditableArea = ref(false);
const showFolderForm = ref(false);
const showEditForm = ref(false);
const editFolder = ref(false);
const delFolder = ref(false);

//specify download format
const HTMLonly = ref(false);
const MDonly = ref(false);

//link share, copy to clipboard
const clone = ref("");
const link = ref("");

//document, folder references
const currDocRef = ref("");
const folderName = ref("");
const folderRef = ref("");
const selectedFolder = ref("");

//user inputs into editable area
const html = ref(""); //HTML rendered string
const text = ref(""); //plaintext string
const name = ref(""); //document name

await awaitSignedIn();
//reference to the docs subcollection
const cRef = useCollection(
  collection(db, "users/" + useCurrentUser()?.value?.uid + "/docs")
);

//reference to the folders document
const fRef = useCollection(
  collection(db, "users/" + useCurrentUser()?.value?.uid + "/folders")
);

const currentFolderId = ref("default");
const folderCounter = ref(0);
const docCounter = ref(0);

const nodes = computed(() => {
  const folderNodes = [
    {
      key: "default",
      label: "Default Folder",
      icon: "pi pi-folder",
      nodeId: "default",
      customParent: false,
      children: [],
    },
    ...fRef.value.map((fref) => ({
      key: fref.id,
      nodeId: fref.id,
      icon: "pi pi-folder",
      customParent: true,
      label: fref.fName,
      children: [],
      docTag: false,
    })),
  ];

  cRef.value.forEach((doc) => {
    const folderId = doc.folderPath;
    const folderNode = folderNodes.find((node) => node.nodeId === folderId);
    if (folderNode) {
      folderNode.children.push({
        key: doc.id,
        nodeId: doc.id,
        icon: "pi pi-file",
        label: doc.docName,
        currText: doc.textString,
        docTag: true,
      });
    }
  });

  return folderNodes;
});

function addFolder() {
  showFolderForm.value = false;
  folderRef.value = createFolder(folderName.value);
  folderName.value = "";
}

//opens selected document in EditableDocument
const onNodeSelect = (node) => {
  const nodeRef = node.nodeId;
  selectedFolder.value = nodeRef;
  if (node.docTag) {
    console.log("selected document:", node);
    showEditableArea.value = false;
    name.value = "";
    text.value = "";
    html.value = "";
    setTimeout(() => {
      showEditableArea.value = true;
      //update file text, file name, and document ID
      text.value = node.currText;
      name.value = node.label;
      currDocRef.value = node.nodeId;
    }, 0);
  } else if (delFolder.value) {
    deleteFolder(nodeRef);
    --folderCounter.value;
    delFolder.value = false;
  } else if (editFolder.value) {
    showEditForm.value = false;
    renameFolder(nodeRef, folderName.value);
    editFolder.value = false;
    selectedFolder.value = "";
  } else {
    console.log("selected folder:", node);
    currentFolderId.value = node.nodeId;
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
    command: () => {
      showFolderForm.value = true;
      folderName.value = "";
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
    html.value,
    currentFolderId.value
  );
  console.log("Saved as new document with Document ID: ", currDocRef.value);
}

//save changes to document
function updateInDatabase() {
  updateDocument(
    name.value,
    text.value,
    html.value,
    currDocRef.value,
    currentFolderId.value
  );
  console.log("Changes written to Document ID: ", currDocRef.value);
}

//permanently delete document
function deleteInDatabase() {
  deleteDocument(currDocRef.value);
  console.log("Permanently deleted Document ID: ", currDocRef.value);
  --docCounter.value;
  deleteConfirmed.value = true;
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

function open(url) {
  window.open(url, "_blank");
}
</script>
<template>
  <div class="markdown">
    <div class="file-tree">
      <Tree
        :value="nodes"
        class="w-full md:w-30rem"
        selectionMode="single"
        @nodeSelect="onNodeSelect"
      >
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
              value: `\Preview`,
              escape: true,
              class: 'custom-message',
            }"
            class="p-button-rounded p-button-text p-button-plain"
            icon="pi pi-eye"
            @click="
              () =>
                open(
                  '/viewdoc/' +
                    useCurrentUser()?.value?.uid +
                    '/' +
                    slotProps.node.nodeId
                )
            "
          ></Button>
          <div v-if="!slotProps.node.docTag && slotProps.node.customParent">
            <Button
              v-tooltip.bottom="{
                value: `Permanently Delete Folder`,
                escape: true,
                class: 'custom-message',
              }"
              class="p-button-rounded p-button-text p-button-plain"
              icon="pi pi-trash"
              @click="delFolder = true"
            ></Button>
            <Button
              v-tooltip.bottom="{
                value: `Edit Folder Name`,
                escape: true,
                class: 'custom-message',
              }"
              class="p-button-rounded p-button-text p-button-plain"
              icon="pi pi-pencil"
              @click="showEditForm = true"
            ></Button>
            <InputText
              v-if="showEditForm && selectedFolder === slotProps.node.nodeId"
              v-tooltip.bottom="{
                value: `Enter name of folder to rename`,
                escape: true,
                class: 'custom-message',
              }"
              class="pi pi-folder"
              type="text"
              v-model="folderName"
              placeholder="Untitled Folder"
            ></InputText>
            <Button
              v-if="showEditForm"
              v-tooltip.bottom="{
                value: `Rename`,
                escape: true,
                class: 'custom-message',
              }"
              icon="pi pi-pencil"
              @click="editFolder = true"
            ></Button>
          </div>
        </template>
      </Tree>
    </div>
    <div class="main-window">
      <!--disable create new button if EditableDocument is open-->
      <SplitButton
        v-tooltip.bottom="{
          value: `Select from Dropdown`,
          escape: true,
          class: 'custom-message',
        }"
        :disabled="showEditableArea"
        :model="newButtonItems"
        icon="pi pi-plus"
        label="New"
        @click="newButtonItems[0].command"
      ></SplitButton>
      <Button
        v-if="showEditableArea"
        v-tooltip.bottom="{
          value: `Close Document`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-times"
        @click="
          showEditableArea = false;
          name = '';
          text = '';
          html = '';
        "
      ></Button>

      <InputText
        v-if="showFolderForm"
        v-tooltip.bottom="{
          value: `Enter name of folder to create`,
          escape: true,
          class: 'custom-message',
        }"
        class="pi pi-folder"
        type="text"
        v-model="folderName"
        placeholder="Untitled Folder"
      ></InputText>
      <Button
        v-if="showFolderForm"
        v-tooltip.bottom="{
          value: `Create`,
          escape: true,
          class: 'custom-message',
        }"
        icon="pi pi-plus"
        @click="addFolder"
      ></Button>

      <EditableDocument
        v-if="showEditableArea"
        :renderText="showHTML"
        :fileContent="text"
        :fileName="name"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
        @error="showError"
      ></EditableDocument>
      <span v-if="showEditableArea" class="p-buttonset">
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
            value: `Select Folder to Save As New Document in a Specific Folder`,
            escape: true,
            class: 'custom-message',
          }"
          icon="pi pi-save"
          @click="addToDatabase"
        ></Button>
        <Button
          v-tooltip.bottom="{
            value: `Save`,
            escape: true,
            class: 'custom-message',
          }"
          :disabled="!currDocRef"
          icon="pi pi-cloud-upload"
          @click="updateInDatabase"
        ></Button>
        <Button
          v-tooltip.bottom="{
            value: `Delete`,
            escape: true,
            class: 'custom-message',
          }"
          :disabled="!currDocRef"
          icon="pi pi-trash"
          @click="
            showDeleteDialog = true;
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
            showShareDialog = true;
            copyConfirmed = false;
          "
        ></Button>
        <SplitButton
          v-tooltip.bottom="{
            value: `Download`,
            escape: true,
            class: 'custom-message',
          }"
          :model="downloadItems"
          icon="pi pi-download"
          @click="initiateDownload"
        ></SplitButton>
      </span>

      <Dialog position="center" v-model:visible="showDeleteDialog">
        <template #header>
          <h3 v-if="deleteConfirmed">Document Permanently Deleted.</h3>
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
            @click="showDeleteDialog = false"
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
              showDeleteDialog = false;
              showEditableArea = false;
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
.markdown {
  display: flex;
  min-height: 95vh;
  width: 100%;
}
.file-tree {
  width: 19vw;
  height: 100%;
  flex-basis: 27%;
  border-right: solid 1.5px rgb(232, 232, 232);
}
.main-window {
  width: 100%;
}
.p-buttonset {
  display: flex;
  justify-content: center;
}
</style>
