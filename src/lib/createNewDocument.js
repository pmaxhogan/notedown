//firebase imports
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance
import getShareableLink from "@/lib/getShareableLink.js";

export default async function createNewDocument(docName, text, html, folderId) {
  const userID = useCurrentUser()?.value?.uid;
  console.log("folder: " + folderId);
  //create new document
  const newDocRef = doc(collection(db, "users/" + userID + "/docs"));
  await setDoc(newDocRef, {
    //data to write to the document
    docName: docName,
    textString: text,
    htmlString: html,
    folderPath: folderId,
    timeStamp: serverTimestamp(),
    docURL: await getShareableLink(newDocRef.id),
  });

  return newDocRef.id;
}
