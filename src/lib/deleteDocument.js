//firebase imports
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function deleteDocument(documentID) {
  const userID = useCurrentUser()?.value?.uid;
  //get reference to document to delete
  const currDocRef = doc(
    collection(db, "users/" + userID + "/docs"),
    documentID
  );

  const docSnap = await getDoc(currDocRef);
  if (docSnap.exists()) {
    await deleteDoc(currDocRef);
  } else {
    throw new Error("Document does not exist");
  }
}
