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

  expect(wrapper.find(".error-message").text()).toBe(
    "Document name should not be empty or start with a special character."
  );

  // Test for document name starting with a special character
  await documentNameInput.setValue("@InvalidName");
  await documentNameInput.trigger("input");

  expect(wrapper.find(".error-message").text()).toBe(
    "Document name should not be empty or start with a special character."
  );
});