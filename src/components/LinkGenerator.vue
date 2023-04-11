<script>
import getShareableLink from "@/lib/getShareableLink.js";
export default {
  data() {
    return {
      link: "",
    };
  },
  methods: {
    sendShareableLink() {
      this.link = getShareableLink();
      this.$emit("shareableLink", this.link);
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
