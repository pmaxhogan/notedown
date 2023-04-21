//firebase imports
import { collection, doc, updateDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { db } from "@/main"; //firestore instance

export default async function updateDocument(documentID, folderName) {
  //get reference to currently open document
  const currDocRef = doc(
    collection(db, "users/" + useCurrentUser()?.value?.uid + "/folders"),
    documentID
  );
  
  await updateDoc(currDocRef, {
    fName: folderName,
  }).then(console.log("ument update successfu"));
}
