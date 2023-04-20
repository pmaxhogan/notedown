<script>
import { computed } from "vue";

export default {
  name: "AppFooter",
  setup() {
    const year = computed(() => new Date().getFullYear());
    return { year };
  },
};
</script>

<template>
  <footer>
    <p>Copyright &copy; {{ year }}</p>
  </footer>
</template>

<style>
footer {
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
}
footer p {
  color: white;
}
</style>
