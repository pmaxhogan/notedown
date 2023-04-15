import { mount } from "@vue/test-utils";
import LinkGenerator from "../components/LinkGenerator.vue";
import initFirebase from "../lib/initFirebase.js";
import { expect, test } from "vitest";

const urlFragment = "/viewdoc/";

initFirebase();

test("Component provides URL that routes to an existing Vue View", async () => {
  expect(LinkGenerator).toBeTruthy();

  const wrapper = mount(LinkGenerator, {
    props: {
      docId: "1234567890",
    },
  });
  // call sendShareableLink
  await wrapper.vm.sendShareableLink();

  expect(wrapper.emitted().shareableLink[0].toString()).toContain(urlFragment);
});

/*references:
https://test-utils.vuejs.org/guide/essentials/event-handling.html#asserting-the-emitted-events
https://v1.test-utils.vuejs.org/api/wrapper/emitted.html
https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-mocked-router
*/
