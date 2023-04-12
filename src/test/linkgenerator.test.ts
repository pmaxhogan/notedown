import { mount } from "@vue/test-utils";
import LinkGenerator from "../components/LinkGenerator.vue";
import { expect, test } from "vitest";

const urlFragment = "https://notedown-web.web.app/viewdoc/"; 

test("Component provides URL that routes to an existing Vue View", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator);

  expect(wrapper.emitted().shareableLink[0].toString()).toContain(urlFragment);
});

/*references:
https://test-utils.vuejs.org/guide/essentials/event-handling.html#asserting-the-emitted-events
https://v1.test-utils.vuejs.org/api/wrapper/emitted.html
https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-mocked-router
*/