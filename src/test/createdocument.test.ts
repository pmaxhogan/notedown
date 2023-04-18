import { mount } from "@vue/test-utils";
import EditableDocument from "../components/EditableDocument.vue";
import { expect, test } from "vitest";
import initFirebase from "../lib/initFirebase.js";
import { collection, doc, getDoc } from "firebase/firestore";
import createNewDocument from "../lib/createNewDocument";
import { db } from "../main.js";

const testUserID = "nnoZk75v1iPwi5EPg6qUAWzRgXK2";
const testDocName = "Test Document";
const testText = "This is a test text.";
const testHtml = "<p>This is a test HTML.</p>";

initFirebase();

test("renders an editable area", async () => {
  const wrapper = mount(EditableDocument, {
    props: {
      renderText: true,
    },
  });
  expect(wrapper.find(".editable-area").exists()).toBe(true);
});

test("displays error message for invalid document names", async () => {
  const wrapper = mount(EditableDocument, {
    props: {
      renderText: true,
    },
  });

  // Test for empty document name
  const documentNameInput = wrapper.find(".edit-filename");
  await documentNameInput.setValue("");
  await documentNameInput.trigger("input");

  expect(wrapper.find(".error-message").text()).toBe(
    "Document name should not be empty or start with a special character."
  );

  // Test for document name starting with a special character
  await documentNameInput.setValue("@InvalidName");
  await documentNameInput.trigger("input");

  expect(wrapper.find(".error-message").text()).toBe(
    "Document name should not be empty or start with a special character."
  );
});

test("document saved in database", async () => {
  const docID = await createNewDocument(testDocName, testText, testHtml);

  const currDocRef = doc(
    collection(db, "users/" + testUserID + "/Default"),
    docID
  );

  const docSnap = await getDoc(currDocRef);
  if (docSnap.exists()) {
    expect(docSnap.data().docName).toEqual(testDocName);
    expect(docSnap.data().textString).toEqual(testText);
  }
});
