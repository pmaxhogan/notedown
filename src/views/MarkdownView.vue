<script setup>
import { onMounted, ref } from "vue";

//style imports
import "@/assets/themes/mytheme/theme.scss";

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
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/main"; //firestore instance

const nodes = ref([
  {
    key: "0",
    label: "Default",
    icon: "pi pi-folder",
    children: [],
  },
]);

function btnclicked(){
  const element = document.getElementById("editDoc");
  const element2 = document.getElementById("createbtn");
  if (element.style.display === "none" && element2.style.display === "block") {
    element.style.display = "block";
    element2.style.display = "none";
  } else {
    element.style.display = "none";
    element2.style.display = "block";
  }
}
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
      showHTML: false,
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
  },
};
</script>
<template>
  <div class="markdown">
    <div class="tree">
      <Tree :value="nodes" id="tree" class="w-full md:w-30rem">
        <template #default="slotProps">
          <b>{{ slotProps.node.label }}</b>
        </template>
      </Tree>
    </div>
    <div class="create">
    <span class="p-buttonset" id="createbtn">
      <button @click="btnclicked()
        ">
        <font-awesome-icon class="icon" icon="fa-solid fa-plus" />
      </button>
      <p>Create New</p>
      <!-- <Button
        label="Create"
        icon="pi pi-file"
        @click="
          this.showEditableDocument = !this.showEditableDocument;
          currDocRef = '';
        "
      ></Button> -->
    </span>
    <div id="editDoc" class="editDoc">
      <EditableDocument
      
        :renderText="showHTML"
        @html="(newHtml) => (html = newHtml)"
        @name="(newName) => (name = newName)"
        @text="(newText) => (text = newText)"
      ></EditableDocument>

    <span class="p-buttonsetDoc">
      <Button class="save"
        label="Save as New"
        icon="pi pi-file"
        @click="addToDatabase"
      ></Button>
      <Button class="save"
        :disabled="!currDocRef"
        icon="pi pi-file"
        label="Save"
        @click="updateInDatabase"
      ></Button>
      <Button class="save"
        :disabled="!currDocRef"
        label="Delete"
        icon="pi pi-trash"
        @click="deleteInDatabase"
      ></Button>
      <SplitButton class="save"
        label="Download"
        icon="pi pi-download"
        @click="initiateDownload"
        :model="downloadItems"
      ></SplitButton>
      <Button class="save"
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
            this.showShareDialog = !this.showShareDialog;
            this.copyConfirmed = false;
          "
          label="Close"
          icon="pi pi-times"
        ></Button>
        <Button v-else @click="copy" label="Copy" icon="pi pi-link"></Button>
      </template>
    </Dialog>
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
.markdown{
  display: flex;
  height: 95vh;
  width: 100%;
}
#tree{
  width: 19vw;
  height: 100%;
}
.create{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.create .p-buttonset{
  text-align: center;
}
.create .p-buttonset button{
  height: 50px;
  width: 50px;
  border: none;
  background-color: rgb(254, 252, 255);
}
.p-buttonset .icon{
  font-size: 40px;
  color: gray;
}
.p-buttonset p{
  font-size: 20px;
  color: gray;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
}

.p-buttonsetDoc{
  display: flex;
  justify-content: center;
}
.save{
  margin-right: 17px;
}


</style>
