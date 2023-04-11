<template>
  <div>
    <h1>{{ thisNote?.docName }}</h1>
    <hr />
    <MarkdownRenderer :content="thisNote?.textString || ''" />
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { useDocument } from "vuefire";
import { doc } from "firebase/firestore";
import { db } from "@/main";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";

const route = useRoute();

const docId = route.params.docid;
const userId = route.params.uid;

if (typeof docId === "undefined" || typeof userId === "undefined") {
  throw new Error("docId or userId is undefined");
}

console.log("doc", docId, userId);

const thisNote = useDocument(doc(db, "users", userId, "docs", docId));
</script>
