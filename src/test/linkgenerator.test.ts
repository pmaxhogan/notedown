import { mount } from "@vue/test-utils";
import LinkGenerator from "../components/LinkGenerator.vue";
import { expect, test } from "vitest";

const validString = "https://notedown-web.web.app/markdown"; //existing page
const invalidString = "https://notedown-web.web.app/faqs"; //page does not exist
const exceptionString = "https://notedown-web.web.app/#markdown\\"; //#, \ are an unsafe character

test("link generator component valid", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator);

  expect(wrapper.emitted().shareableLink[0].toString()).toEqual(validString);
});

test("link generator component invalid", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator);
  
  expect(wrapper.emitted().shareableLink[0].toString()).not.toEqual(invalidString);
});

test("link generator component exception encountered", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator);
  
  expect(wrapper.emitted().shareableLink[0].toString()).not.toEqual(exceptionString);
});

/*references:
https://test-utils.vuejs.org/guide/essentials/event-handling.html#asserting-the-emitted-events
https://v1.test-utils.vuejs.org/api/wrapper/emitted.html
https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-mocked-router
*/