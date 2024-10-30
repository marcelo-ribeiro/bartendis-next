/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseFirestore } from "../libraries/firebase";

export const usersCollection = collection(firebaseFirestore, "users");

export const useUser = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setUser] = useState();
  const querySnapshot = await getDocs(collection(firebaseFirestore, "users"));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const payload: any = [];
    querySnapshot.forEach((doc) => {
      payload.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setUser(payload);
  }, [querySnapshot]);

  return {
    user,
  };
};
