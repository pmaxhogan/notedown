<script>
  export default{
    data(){
    },
    methods:{
      hello(){
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        if(email === '' || email.length < 10 || password === '' || password.length < 6){
          alert("Invalid email or password");
        }
        else{
          window.location.href = '/markdown';
        }
      },
    }
  };
</script>

<template>
  <form action="" id="form">
    <label for="email">Email:</label>
    <br>
    <input type="email" id="email" v-model="email">
    <div class="error"></div>
    <br>
    <label for="password">Password:</label>
    <br>
    <input type="password" id="password">
    <div class="error"></div>
  </form>
  <button type="submit" @click="hello">Log in</button>
</template>
