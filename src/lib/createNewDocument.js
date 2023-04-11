//firebase imports
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function createNewDocument(docName, text, html) {
  const userID = useCurrentUser()?.value?.uid;
  //create new document
  const newDocRef = doc(collection(db, "users/" + userID + "/Default"));
  await setDoc(newDocRef, {
    //data to write to the document
    docName: docName,
    textString: text,
    htmlString: html,
    timeStamp: serverTimestamp(),
  });
  return newDocRef.id;
}