import { mount } from "@vue/test-utils";
import EditableDocument from "../components/EditableDocument.vue";
import { expect, test } from "vitest";

test("renders an editable area", async () => {
    const wrapper = mount(EditableDocument);
    expect(wrapper.find(".editable-area").exists()).toBe(true);
  });

  


