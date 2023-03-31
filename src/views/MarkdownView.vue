<script setup>
import { ref } from "vue";
import download from "@/lib/download.js";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Tree from "primevue/tree";
import "@/assets/themes/mytheme/theme.scss";

<<<<<<< HEAD
var nodeID = [0, 1];
var childrenCount = [0, 0];
var currNode = 1;
var HTMLonly = false;
var MDonly = false;
=======
let nodeID = [0, 1];
let childrenCount = [0, 0];
let currNode = 1;
let HTMLonly = false;
let MDonly = false;
>>>>>>> 6f1fae633212bf422a0a6361e43b787d382b4404

const html = ref("");
const text = ref("");
const name = ref("Untitled Document");
const nodes = ref([
  {
    key: "" + nodeID[0],
    label: "Default",
    icon: "pi pi-folder",
    children: [],
  },
  {
    key: "" + nodeID[1],
    label: "Trash",
    icon: "pi pi-trash",
    children: [],
  },
]);

const docActions = ref([
  {
    label: "Add to Default",
    icon: "pi pi-plus",
    command: () => {
      nodes.value[0].children.push({
        key: "0-" + childrenCount[0],
        label: name.value + ".html",
        data: text.value,
      });
      childrenCount[0]++;
    },
  },
  {
    label: "Move to Trash",
    icon: "pi pi-trash",
    command: () => {
      childrenCount[0]--;
      nodes.value[0].children.splice(childrenCount[0]);
      nodes.value[1].children.push({
        key: "1-" + childrenCount[1],
        label: name.value + ".html",
        data: text.value,
      });
      childrenCount[1]++;
    },
  },
  {
    label: "Clear Trash",
    icon: "pi pi-truck",
    command: () => {
      nodes.value[1].children.splice(0);
      childrenCount[1] = 0;
    },
  },
]);

const folderActions = ref([
  {
    label: "Delete Folder",
    icon: "pi pi-trash",
    command: () => {
      //delete only user created folders
      if (currNode > 1) {
        nodes.value.splice(nodeID[currNode]);
        nodeID.splice(currNode);
        currNode--;
      }
    },
  },
]);

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

function createNodes() {
  nodeID.push(++currNode);
  nodes.value.push({
    key: "" + nodeID[currNode],
    label: "New Folder " + nodeID[currNode],
    icon: "pi pi-folder",
    children: [],
  });
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
      <SplitButton
        @click="toggleEditableDocument"
        label="New Document"
        icon="pi pi-file"
        :model="docActions"
      ></SplitButton>
      <SplitButton
        label="Download"
        icon="pi pi-download"
        @click="initiateDownload"
        :model="downloadItems"
      ></SplitButton>
      <SplitButton
        @click="createNodes"
        label="New Folder"
        icon="pi pi-folder"
        :model="folderActions"
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
