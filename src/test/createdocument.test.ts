import { mount } from "@vue/test-utils";
import EditableDocument from "../components/EditableDocument.vue";
import { expect, test } from "vitest";

test("renders an editable area", async () => {
  const wrapper = mount(EditableDocument);
  expect(wrapper.find(".editable-area").exists()).toBe(true);
});

test("displays error message for invalid document names", async () => {
  const wrapper = mount(EditableDocument);

  // Test for empty document name
  const documentNameInput = wrapper.find(".edit-filename");
  await documentNameInput.setValue("");
  await documentNameInput.trigger("input");

  expect(wrapper.emitted().update).toBeTruthy();
  expect(wrapper.emitted().update[0]).toEqual(["New content"]);
});

test("handles focus and blur events", async () => {
  const wrapper = mount(EditableDocument);
  const editableArea = wrapper.find(".editable-area");

  await editableArea.trigger("focus");
  expect(wrapper.vm.isFocused).toBe(true);

  await editableArea.trigger("blur");
  expect(wrapper.vm.isFocused).toBe(false);
});
