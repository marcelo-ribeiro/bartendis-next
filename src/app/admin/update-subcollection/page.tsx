/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { firebaseFirestore } from "../../libraries/firebase";

const storeId = "ZQDsQzxzw0oWxVBviZOS";
const categoryId = "y6s0hUScHknQ4xgSqPU2";
// Referências para as sub-coleções antiga e nova
const oldSubCollectionRef = collection(
  firebaseFirestore,
  "stores",
  storeId,
  "categories",
  categoryId,
  "products "
);
const newSubCollectionRef = collection(
  firebaseFirestore,
  "stores",
  storeId,
  "categories",
  categoryId,
  "products"
);
const UpdateSubcollection = () => {
  useEffect(() => {
    async function moveDocuments() {
      try {
        const snapshot = await getDocs(oldSubCollectionRef);
        const promises = snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          // Criar novo documento na nova sub-coleção
          const newDocRef = doc(newSubCollectionRef, docSnapshot.id);
          await setDoc(newDocRef, data);
          // Apagar documento da sub-coleção antiga (opcional)
          const oldDocRef = doc(oldSubCollectionRef, docSnapshot.id);
          await deleteDoc(oldDocRef);
        });
        await Promise.allSettled(promises);
        alert("Subcollection name changed successfully!");
      } catch (error: any) {
        console.log(error?.message);
      }
    }
    moveDocuments();
  }, []);
  return <></>;
};

export default UpdateSubcollection;
