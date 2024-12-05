/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { firebaseFirestore } from "../libraries/firebase";
import { StoreProps } from "./useStore";
import { getDocumentIdBySlug } from "./utils";

export type TOrder = {
  id: string;
  created: string;
  slot: string;
  product: string;
  quantity: number;
  status: string;
};

export const useOrders = (slug: string | null, store: StoreProps | null) => {
  const [orders, setOrders] = useState<TOrder[]>();
  const [storeId, setStoreId] = useState<string | null>("");

  const getStoreId = useCallback(async () => {
    if (!slug) return;
    if (storeId) return storeId;
    const id = await getDocumentIdBySlug(slug);
    setStoreId(id);
    return id;
  }, [slug, storeId]);

  async function generateOrder({
    slot,
    product,
    quantity,
    status,
  }: {
    slot: string;
    product: string;
    quantity: number;
    status: string;
  }) {
    if (!storeId) return;

    const ordersCollection = collection(
      firebaseFirestore,
      `stores`,
      storeId,
      "orders"
    );
    const docRef = await addDoc(ordersCollection, {
      created: serverTimestamp(),
      slot,
      product,
      quantity,
      status
    });
    console.log("docRef :", docRef);
  }

  const getOrders = useCallback(
    (storeId: string) => {
      if (!storeId) return;

      const ordersRef = collection(
        firebaseFirestore,
        `stores`,
        storeId,
        "orders"
      );

      const querySnapshot = query(
        ordersRef,
        where("created", ">=", store!.openAt),
        orderBy("created", "desc")
      );
      return onSnapshot(querySnapshot, (snapshot) => {
        const payload: any = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          payload.push({
            ...data,
            id: doc.id,
            created: data.created.toMillis(),
          });
        });
        setOrders(payload);
      });
    },
    [store]
  );

  async function changeOrderStatus(orderId: string, status: string) {
    if (!storeId) return;
    const docRef = doc(firebaseFirestore, `stores`, storeId, "orders", orderId);
    await updateDoc(docRef, { status });
  }

  useEffect(() => {
    if (!slug || !store) return;
    if (!!orders) return;
    getStoreId().then((storeId) => {
      if (!storeId) return;
      getOrders(storeId);
    });
  }, [getOrders, getStoreId, orders, slug, store]);

  return {
    generateOrder,
    orders,
    changeOrderStatus,
    getOrders,
  };
};
