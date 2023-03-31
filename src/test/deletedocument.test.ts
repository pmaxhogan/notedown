import { mount } from "@vue/test-utils";
import EditableDocument from "../components/EditableDocument.vue";
import { expect, test } from "vitest";
import DeleteButton from "../components/DeleteButton.vue";


test("deletes a document on click of delete button", () => {
  const noteIdToDelete = "2";
  const notes = [
    { id: "1", content: "Note 1" },
    { id: noteIdToDelete, content: "Note 2" },
    { id: "3", content: "Note 3" },
  ];

  const wrapper = mount(EditableDocument, {
    props: {
      notes,
      renderText: (text) => text(),
    },
    global: {
      components: {
        DeleteButton,
      },
    },
  });

  const deleteButton = wrapper.findComponent(DeleteButton);
  deleteButton.vm.$emit("delete-note", noteIdToDelete);

  expect(wrapper.emitted().delete).toBeTruthy();
  expect(wrapper.emitted().delete[0]).toEqual([noteIdToDelete]);

  const deletedNote = wrapper.findAll(`[data-note-id="${noteIdToDelete}"]`);
  expect(deletedNote).toHaveLength(0);
  return [];
});















  