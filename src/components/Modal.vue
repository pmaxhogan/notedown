<!-- eslint-disable vue/multi-word-component-names -->
<!--code modified from 
  https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component
https://visualbean.medium.com/how-to-copy-to-clipboard-with-vuejs-a1b7ffb1170e
 -->

<script>
export default {
  name: "Modal",
  data() {
    return {
      text: "goodbye cruel world sigh",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    copy() {
      this.$refs.clone.focus();
      document.execCommand("copy");
      alert("Copied!");
    },
    copy_display_close(){
      this.copy();
      this.close();
    }
  },
};
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header"> </slot>
        <button type="button" class="btn-close" @click="close">x</button>
      </header>

      <section class="modal-body">
        <slot name="body"> </slot>
        <div id="app">
          <input
            v-on:focus="$event.target.select()"
            ref="clone"
            readonly
            :value="text"
          />
        </div>
      </section>

      <footer class="modal-footer">
        <slot name="footer"> </slot>
        <button type="button" class="btn-copy" @click="copy_display_close">Copy</button>
      </footer>
    </div>
  </div>
</template>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #a982c6;
  box-shadow: 2px 2px 15px 1px #a982c6;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 20px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px transparent #eeeeee;
  color: #000000;
  font-weight: bold;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px transparent #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 10px 20px;
}

.btn-close {
  position: absolute;
  top: 30%;
  bottom: 30%;
  right: 4%;
  left: 88%;
  border: none;
  font-size: 15px;
  padding: 0px;
  cursor: pointer;
  color: #fff9fe;
  background: #322467;
  border: 1px solid #322467;
  border-radius: 50px;
}

.btn-copy {
  color: #fff9fe;
  background: #322467;
  border: 1px solid #322467;
  border-radius: 8px;
}

.btn {
  border: 1px solid #322467;
  font-size: 15px;
  font-weight: bold;
  padding: 5px;
  cursor: pointer;
  color: #fff9fe;
  background: #322467;
  border: 1px solid #322467;
  border-radius: 8px;
}
</style>
