import { mount } from "@vue/test-utils";
import EditableDocument from "../components/EditableDocument.vue";
import { expect, test } from "vitest";

test("renders an editable area", async () => {
  const wrapper = mount(EditableDocument);
  expect(wrapper.find(".editable-area").exists()).toBe(true);
});

test("emits update event on content change", async () => {
  const wrapper = mount(EditableDocument);
  const editableArea = wrapper.find(".editable-area");

  editableArea.element.innerHTML = "New content";
  await editableArea.trigger("input");

  expect(wrapper.emitted().update).toBeTruthy();
  expect(wrapper.emitted().update[0]).toEqual(["New content"]);
});

test("handles focus and blur events", async () => {
  const wrapper = mount(EditableDocument);
  const editableArea = wrapper.find(".editable-area");

  await editableArea.trigger("focus");
  expect(editableArea.element.getAttribute("is-focused")).toBe("true");

  await editableArea.trigger("blur");
  expect(editableArea.element.getAttribute("is-focused")).toBe("false");
});

test("deletes a document on click of delete button", () => {
  const noteIdToDelete = "2";
  const notes = [
    { id: "1", content: "Note 1" },
    { id: noteIdToDelete, content: "Note 2" },
    { id: "3", content: "Note 3" },
  ];

  const wrapper = mount(EditableDocument, {
    props: { notes },
  });

  const deleteButton = wrapper.find(`[data-note-id="${noteIdToDelete}"] .delete-button`);
  deleteButton.trigger("click");

  expect(wrapper.emitted().delete).toBeTruthy();
  expect(wrapper.emitted().delete[0]).toEqual([noteIdToDelete]);
});

  