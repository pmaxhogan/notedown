<template>
  <div class="editable-document">
    <div
      ref="editableArea"
      class="editable-area"
      contenteditable="true"
      @input="onContentChange"
      @blur="onBlur"
      @focus="onFocus"
    ></div>
  </div>
</template>

<script>
export default {
  name: "EditableDocument",

  data() {
    return {
      focused: false,
    };
  },

  computed: {
    isFocused() {
      return this.focused;
    },
  },

  methods: {
    onContentChange() {
      const content = this.$refs.editableArea.innerHTML;
      this.$emit("update", content);
    },

    onBlur() {
      this.focused = false;
    },

    onFocus() {
      this.focused = true;
    },
  },
};
</script>

<style scoped>
.editable-document {
  position: relative;
}

.editable-area {
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  resize: vertical;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
