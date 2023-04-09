//firebase imports
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function updateDocument(text, html, documentID) {
  //get reference to currently open document
  const userID = useCurrentUser()?.value?.uid;
  const currDocRef = doc(
    collection(db, "users/" + userID + "/Default"),
    documentID
  );

  await updateDoc(currDocRef, {
    textString: text,
    htmlString: html,
    timeStamp: serverTimestamp(),
  });

  console.log("Changes written to document " + documentID);
}
