import { getAuth } from "firebase/auth";
import initFirebase from "@/lib/initFirebase";

export default async function getShareableLink(documentID) {
  const currentUid = (await getAuth())?.currentUser?.uid;
  const path = `/viewdoc/${currentUid}/${documentID}`;
  return new URL(path, location.href).href;
}
