import { mount } from "@vue/test-utils";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import { expect, test } from "vitest";

const validString = `
# Hello Markdown!
$$\\frac\\alpha\\beta$$
`.trim();

const invalidString = `
$$\\notanescape$$

\`unclosed code block
`.trim();

const errorString = "a".repeat(10 * 1000 * 1000 + 1);

test("markdown renderer component valid", async () => {
  expect(MarkdownRenderer).toBeTruthy();

  const wrapper = mount(MarkdownRenderer, {
    props: {
      content: validString,
    },
  });

  expect(wrapper.find("#hello-markdown").text()).toBe("Hello Markdown!");
  expect(wrapper.html()).toMatchSnapshot();
});

test("markdown renderer component invalid", async () => {
  expect(MarkdownRenderer).toBeTruthy();

  const wrapper = mount(MarkdownRenderer, {
    props: {
      content: invalidString,
    },
  });

  expect(wrapper.find("code").exists()).toBe(false);
  expect(wrapper.html()).toMatchSnapshot();
});

test("markdown renderer component error", async () => {
  expect(MarkdownRenderer).toBeTruthy();

  expect(() =>
    mount(MarkdownRenderer, {
      props: {
        content: errorString,
      },
    })
  ).toThrow();
});
