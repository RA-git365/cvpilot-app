import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function saveResumeCloud(
  user,
  form,
  ats,
  template
) {
  if (!user) {
    throw new Error(
      "Login required"
    );
  }

  await addDoc(
    collection(
      db,
      "resumes"
    ),
    {
      uid: user.uid,
      email:
        user.email,
      form,
      ats,
      template:
        template.name,
      createdAt:
        serverTimestamp(),
    }
  );
}