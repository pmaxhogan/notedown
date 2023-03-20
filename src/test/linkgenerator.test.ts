import { mount } from "@vue/test-utils";
import LinkGenerator from "../components/LinkGenerator.vue";
import { expect, test } from "vitest";

const validString = "https://notedown-web.web.app/markdown"; //existing page
const invalidString = "https://notedown-web.web.app/faqs"; //page does not exist
const exceptionString = "https://notedown-web.web.app/#markdown\\"; //#, \ are an unsafe character

test("link generator component valid", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator, {
    props: {
      content: validString,
    },
  });

  expect(wrapper.emitted()).toBeTruthy();
});

test("link generator component invalid", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator, {
    props: {
      content: invalidString,
    },
  });

  expect(wrapper.emitted()).toBeTruthy();
});

test("link generator component exception", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator, {
    props: {
      content: exceptionString,
    },
  });

  expect(wrapper.emitted()).toBeTruthy();
});