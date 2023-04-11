//firebase imports
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function deleteDocument(documentID) {
  const userID = useCurrentUser()?.value?.uid;
  //get reference to document to delete
  const currDocRef = doc(
    collection(db, "users/" + userID + "/docs"),
    documentID
  );
  await deleteDoc(currDocRef);
}
