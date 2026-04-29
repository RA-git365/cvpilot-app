import {
  doc,
  deleteDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function deleteResume(
  id
) {
  await deleteDoc(
    doc(
      db,
      "resumes",
      id
    )
  );
}

export async function duplicateResume(
  item
) {
  await addDoc(
    collection(
      db,
      "resumes"
    ),
    {
      uid: item.uid,
      email:
        item.email,
      form: item.form,
      ats: item.ats,
      template:
        item.template,
      createdAt:
        serverTimestamp(),
    }
  );
}