<script>
import getShareableLink from "@/lib/getShareableLink.js";

export default {
  data() {
    return {
      link: "",
    };
  },
  props: {
    docId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async sendShareableLink() {
      this.link = await getShareableLink(this.docId);
      this.$emit("shareableLink", this.link);
      //emit is used to send data from child component to parent
    },
  },
  emits: ["shareableLink"],
  mounted() {
    this.sendShareableLink();
  },
  render() {
    return [];
  },
};
</script>
