import { getAuth } from "firebase/auth";

export default async function getShareableLink(documentID) {
  const currentUid = (await getAuth())?.currentUser?.uid;
  const path = `/viewdoc/${currentUid}/${documentID}`;
  return new URL(path, location.href).href;
}
