import deleteDocument from "../lib/deleteDocument.js";
import createNewDocument from "../lib/createNewDocument.js";
import initFirebase from "../lib/initFirebase.js";
import { expect, test } from "vitest";

initFirebase();

const name = "Hello World";
const text = "# Hello Markdown! $$\\frac\\alpha\\beta$$";
const html =
  '<h1 id="markdown-test">Markdown Test!</h1> <p>(\text{M}alpha\text{thjax Test})</p> ';
let documentID = "";
documentID = await createNewDocument(name, text, html);
console.log("Document created with ID: ", documentID);

test("Exisitng document deleted from Firebase", async () => {
  expect(deleteDocument).toBeTruthy();

  /*
   *deleteDocument returns a promise object
   *that resolves when the document has been successfully deleted
   *the then method is called when the promise is resovled
   *the catch method is called if is it not resolved
   */
  const validCase = await deleteDocument(documentID)
    .then(() => {
      console.log("Document deleted with ID: ", documentID);
      return "Document Deletion Successful";
    })
    .catch((error) => {
      console.log("Error. Document not deleted.", error);
      return "Error. Document not deleted.";
    });

  expect(validCase).toBe("Document Deletion Successful");
});

test("Nonexistent document deleted from Firebase", async () => {
  expect(deleteDocument).toBeTruthy();

  /*
   *deleteDocument returns a promise object
   *that resolves when the document has been successfully deleted
   *the then method is called when the promise is resovled
   *the catch method is called if is it not resolved
   */
  const invalidCase = await deleteDocument(documentID)
    .then(() => {
      console.log("Document deleted with ID: ", documentID);
      return "Document Deletion Successful";
    })
    .catch((error) => {
      // console.log(error);
      return error.toString();
    });

  expect(invalidCase).toBe("Error: Document does not exist");
});
