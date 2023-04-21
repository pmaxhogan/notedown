//firebase imports
import { collection, doc, setDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function createFolder(name) {
  const newDocRef = doc(
    collection(db, "users/" + useCurrentUser()?.value?.uid + "/folders")
  );
  await setDoc(newDocRef, { fName: name }, { merge: true });
  
  return newDocRef.id;
}
