<template>
  <form action="" id="form">
    <div v-if="error && error.length">
      <p v-for="e in error" v-bind:key="e.id"> {{ e }}</p>
    </div>
    <label for="email">Email:</label>
    <br>
    <input type="email" id="email" v-model="email">
    <div class="error"></div>
    <br>
    <label for="password">Password:</label>
    <br>
    <input type="password" id="password" v-model="password">
  </form>
  <button type="submit" @click="login">Log in</button>
</template>

<script>
  export default{
    name: 'LoginForm',
    data(){
      return{
        error: [],
        email: '',
        password: '',
      }
    },
    methods: {
      login(){
        // const email = document.getElementById('email').value
        // const password = document.getElementById('password').value
        this.error = [];
        if(!this.email){
          this.error.push("Invalid email");
        }
        if(!this.password){
          this.error.push("Invalid password");
        }
        if(this.error.length <= 0){
          window.location.href='/';
        }
      }
    }
  }

</script>