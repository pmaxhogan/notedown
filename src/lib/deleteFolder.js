//firebase imports
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function deleteDocument(documentID) {
  const currDocRef = doc(
    collection(db, "users/" + useCurrentUser()?.value?.uid + "/folders"),
    documentID
  );

  const docSnap = await getDoc(currDocRef);
  if (docSnap.exists()) {
    await deleteDoc(currDocRef);
  } else {
    throw new Error("Folder does not exist");
  }
}
