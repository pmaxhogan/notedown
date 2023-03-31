import { mount } from "@vue/test-utils";
import EditableDocument from "../components/EditableDocument.vue";
import { expect, test } from "vitest";
import { nextTick } from "vue";



test("deletes a document on click of delete button", async () => {
  const noteIdToDelete = "2";
  const notes = [
    { id: "1", content: "Note 1" },
    { id: noteIdToDelete, content: "Note 2" },
    { id: "3", content: "Note 3" },
  ];

  const wrapper = mount(EditableDocument, {
    props: { notes },
  });

  await nextTick(); 

  const deleteButton = wrapper.find(`[data-note-id="${noteIdToDelete}"] .delete-button`);
  deleteButton.trigger("click");

  expect(wrapper.emitted().delete).toBeTruthy();
  expect(wrapper.emitted().delete[0]).toEqual([noteIdToDelete]);
});









  