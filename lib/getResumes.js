import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

export async function getUserResumes(
  user
) {
  if (!user)
    return [];

  const q = query(
    collection(
      db,
      "resumes"
    ),
    where(
      "uid",
      "==",
      user.uid
    ),
    orderBy(
      "createdAt",
      "desc"
    )
  );

  const snapshot =
    await getDocs(
      q
    );

  return snapshot.docs.map(
    (
      doc
    ) => ({
      id: doc.id,
      ...doc.data(),
    })
  );
}