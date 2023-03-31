<template>
    <button class="delete-button" @click="deleteNote">
      <i class="fas fa-trash"></i> Delete
    </button>
  </template>
  
  <script lang="ts">
  export default {
    props: {
      noteId: {
        type: Number,
        required: true
      }
    },
    methods: {
      deleteNote() {
        this.$emit('delete-note', this.noteId);
        return [];
      }
    }
  }
  </script>
  
  <style scoped>
  .delete-button {
    background-color: #7519b3;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
  }
  </style>
  
  