import { mount } from "@vue/test-utils";
import HelloWorld from "../components/HelloWorld.vue";
import { expect, test } from "vitest";

test("hello world component", async () => {
  expect(HelloWorld).toBeTruthy();

  const wrapper = mount(HelloWorld, {
    props: {
      msg: "test msg",
    },
  });

  expect(wrapper.text()).toContain("test msg");
  expect(wrapper.html()).toMatchSnapshot();

  // check that the .green class is applied to msg
  expect(wrapper.find(".green").exists()).toBe(true);
  expect(wrapper.find(".green").text()).toBe("test msg");
});
