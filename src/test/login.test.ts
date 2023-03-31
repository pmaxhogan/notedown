import { mount } from "@vue/test-utils";
import Login from "../components/Login.vue";
import { expect, test } from "vitest";

const validEmail = "random123@gmail.com";
const validPassword = "hello123";
const invalid = '';


test("valid information", async () => {
  const wrapper = mount(Login);
  

  await wrapper.find('input[type=email]').setValue(validEmail)
  await wrapper.find('input[type=password]').setValue(validPassword)
  await wrapper.find('button').trigger('click');

  expect(wrapper.vm.email).toBe(validEmail);
  expect(wrapper.vm.password).toBe(validPassword);
  expect(Login).toBeTruthy()

})
test("Invalid password"), async () => {
  const wrapper = mount(Login);
  

  await wrapper.find('input[type=email]').setValue(validEmail)
  await wrapper.find('input[type=password]').setValue(invalid)
  await wrapper.find('button').trigger('click');

  expect(wrapper.vm.email).toBe(validEmail);
  expect(wrapper.vm.password).toBe(invalid);
}
test("Invalid email"), async () => {
  const wrapper = mount(Login);
  

  await wrapper.find('input[type=email]').setValue(invalid)
  await wrapper.find('input[type=password]').setValue(validPassword)
  await wrapper.find('button').trigger('click');

  expect(wrapper.vm.email).toBe(invalid);
  expect(wrapper.vm.password).toBe(validPassword);
}
test("Invalid email/password"), async () => {
  const wrapper = mount(Login);
  

  await wrapper.find('input[type=email]').setValue(invalid)
  await wrapper.find('input[type=password]').setValue(invalid)
  await wrapper.find('button').trigger('click');

  expect(wrapper.vm.email).toBe(invalid);
  expect(wrapper.vm.password).toBe(invalid);
}

