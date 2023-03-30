<script>
export default {
  data() {
    return {
      pseudoLink: "https://notedown-web.web.app/markdown",
    };
  },
  methods: {
    sendShareableLink() {
      this.$emit("shareableLink", this.pseudoLink);
      //emit is used to send data from child component to parent
    },
  },
  mounted() {
    this.sendShareableLink();
  },
  render() {
    return [];
  },
};
</script>
