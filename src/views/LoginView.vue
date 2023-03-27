<script setup lang="ts">
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import * as yup from 'yup';
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(7).required(),
});
    function onSubmit(){
        alert("Successfully logged in");
    }
    function onInvalid(){
        alert("Invalid username or password");
    }

</script>

<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema" @invalid-submit="onInvalid">
      <div>
        <label for="email">Email</label>
        <br>
        <Field id="email" name="email" type="email" />
        <br>
        <label for="password">Password</label>
        <br>
        <Field id="password" name="password" type="password" />
        <ErrorMessage name="password" />
      </div>
      <button type="submit" class="submit">Submit</button>
    </Form>
  </div>
</template>
