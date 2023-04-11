<script setup>
import { ref, onMounted } from "vue";

//style imports
import "@/assets/themes/mytheme/theme.scss";
import "@/assets/styles/gradient-background.scss";

//Database Helper Functions
import download from "@/lib/download.js";
import createNewDocument from "@/lib/createNewDocument.js";
import updateDocument from "@/lib/updateDocument.js";
import deleteDocument from "@/lib/deleteDocument.js";

//PrimeVue Components
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Tree from "primevue/tree";

//firestore imports
import { useCurrentUser } from "vuefire";
// eslint-disable-next-line prettier/prettier
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/main"; //firestore instance

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
    "users/" + useCurrentUser()?.value?.uid + "/Default"
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

const currDocRef = ref("");

const html = ref("");
const text = ref("");
const name = ref("Untitled Document");

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
    <div>
      <Tree :value="nodes" class="w-full md:w-30rem">
        <template #default="slotProps">
          <b>{{ slotProps.node.label }}</b>
        </template>
      </Tree>
    </div>

    <span class="p-buttonset">
      <Button
        label="Create"
        icon="pi pi-file"
        @click="toggleEditableDocument"
      ></Button>
    </span>

    <div>
      <EditableDocument
        v-if="showEditableDocument"
        :renderText="showHTML"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
      ></EditableDocument>
    </div>

    <span class="p-buttonset" v-if="showEditableDocument">
      <Button
        label="Save as New"
        icon="pi pi-file"
        @click="addToDatabase"
      ></Button>
      <Button label="Save" icon="pi pi-file" @click="updateInDatabase"></Button>
      <Button
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

.markdown {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
</style>
