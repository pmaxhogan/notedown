import { saveAs } from "file-saver";

export default function download(text, doc, extension) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, doc + "." + extension);
}
