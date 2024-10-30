import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseFirestore } from "../libraries/firebase";

export async function getDocumentIdBySlug(slug: string) {
  // Create a reference to the collection
  const collectionRef = collection(firebaseFirestore, "stores");

  // Query the collection for documents where the 'slug' field matches the given slug
  const q = query(collectionRef, where("slug", "==", slug));

  // Execute the query
  const querySnapshot = await getDocs(q);

  // Check if any documents were returned
  if (!querySnapshot.empty) {
    // Get the document ID of the first matching document
    const documentId = querySnapshot.docs[0].id;
    return documentId;
  } else {
    // No document with the given slug was found
    return null;
  }
}
