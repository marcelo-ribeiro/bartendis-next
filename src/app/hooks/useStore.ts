/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { firebaseFirestore } from "../libraries/firebase";
import { getDocumentIdBySlug } from "./utils";

export type StoreProps = {
  id?: string;
  name: string;
  slug: string;
  openAt: Timestamp;
  open: boolean;
};

export type TProduct = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

export type TOrder = {
  id: string;
  created: string;
  slotName: string;
  productName: string;
  quantity: number;
};

export async function getStoreId(slug: string) {
  if (!slug) return;
  const id = await getDocumentIdBySlug(slug);
  return id;
}

export async function loadStore(storeId: string | null) {
  if (!storeId) return;
  const docRef = doc(firebaseFirestore, `stores`, storeId);
  const listDocSnap = await getDoc(docRef);
  return listDocSnap.data() as StoreProps;
}

export async function getMenu(storeId: string | null) {
  if (!storeId) return;

  const categoriesRef = collection(
    firebaseFirestore,
    `stores`,
    storeId,
    "categories"
  );
  const categoriesQuery = query(categoriesRef, orderBy("name"));
  const categoriesDocs = await getDocs(categoriesQuery);
  const categories: any = {};
  const menu: any = {};

  categoriesDocs.forEach((category) => {
    if (category.id) categories[category.id] = category.data().name;
    if (category.data().name) menu[category.data().name] = [];
  });

  for (const category in categories) {
    const categoryProductsRef = collection(
      firebaseFirestore,
      `stores`,
      storeId,
      "categories",
      category,
      "products"
    );
    const productsQuery = query(categoryProductsRef, orderBy("name"));
    const categoryProductsDocs = await getDocs(productsQuery);

    categoryProductsDocs.forEach((product) => {
      menu[categories[category]].push({ id: product.id, ...product.data() });
    });
  }

  return menu;
}

export const useStore = (slug: string | null) => {
  const [store, setStore] = useState<StoreProps | null>(null);
  // const store = useRef<StoreProps | null>(null);
  const [menu, setMenu] = useState<{ ["key"]: TProduct[] } | null>(null);
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [storeId, setStoreId] = useState<string | null>("");
  // const storeId = useRef<string | null>(null);

  const getStoreId = useCallback(async () => {
    if (!slug) return;
    const id = await getDocumentIdBySlug(slug);
    setStoreId(id);
    // storeId.current = id;
    return id;
  }, [slug]);

  // const storeCollectionRef = useMemo(() => {
  //   if (!storeId) return null;
  //   return doc(firebaseFirestore, `stores`, storeId);
  // }, [storeId]);

  async function loadStore(storeId: string | null) {
    console.log("loadStore :", storeId);
    if (!storeId) return;
    const docRef = doc(firebaseFirestore, `stores`, storeId);
    const listDocSnap = await getDoc(docRef);
    setStore(listDocSnap.data() as StoreProps);
    // store.current = listDocSnap.data() as StoreProps;
  }

  async function getMenu(storeId: string | null) {
    if (!storeId) return;

    const categoriesRef = collection(
      firebaseFirestore,
      `stores`,
      storeId,
      "categories"
    );
    const categoriesQuery = query(categoriesRef, orderBy("name"));
    const categoriesDocs = await getDocs(categoriesQuery);
    const categories: any = {};
    const menu: any = {};

    categoriesDocs.forEach((category) => {
      if (category.id) categories[category.id] = category.data().name;
      if (category.data().name) menu[category.data().name] = [];
    });

    for (const category in categories) {
      const categoryProductsRef = collection(
        firebaseFirestore,
        `stores`,
        storeId,
        "categories",
        category,
        "products"
      );
      const productsQuery = query(categoryProductsRef, orderBy("name"));
      const categoryProductsDocs = await getDocs(productsQuery);

      categoryProductsDocs.forEach((product) => {
        menu[categories[category]].push({ id: product.id, ...product.data() });
      });
    }

    setMenu(menu);
  }

  async function generateOrder({
    slotName,
    productName,
    quantity,
  }: {
    slotName: string;
    productName: string;
    quantity?: number;
  }) {
    if (!storeId) return;

    const ordersCollection = collection(
      firebaseFirestore,
      `stores`,
      storeId,
      "orders"
    );
    const docOptions: any = {
      created: serverTimestamp(),
      slotName,
      productName,
    };
    if (quantity) docOptions.quantity = quantity;
    await addDoc(ordersCollection, docOptions);
  }

  async function getOrders() {
    if (!storeId) return;

    const ordersRef = collection(
      firebaseFirestore,
      `stores`,
      storeId,
      "orders"
    );

    const querySnapshot = query(ordersRef, orderBy("created", "desc"));
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
  }

  async function openSells() {
    if (!storeId) return;
    const docRef = doc(firebaseFirestore, `stores`, storeId);
    console.log("docRef :", docRef);
    updateDoc(docRef, { openAt: new Date() });
  }

  // async function getProductById(productId: string) {
  //   const productRef = doc(
  //     firebaseFirestore,
  //     `stores`,
  //     storeId,
  //     `products`,
  //     productId
  //   );
  //   const productSnap = await getDoc(productRef);
  //   return productSnap.data() as Promise<TProduct>;
  // }

  useEffect(() => {
    if (!!store || !!menu) return;
    getStoreId().then((storeId) => {
      if (!storeId) return;
      loadStore(storeId);
      getMenu(storeId);
    });
  }, [getStoreId, menu, store, storeId]);

  // const add = (data: ListProps) => {
  //   if (!listsCollectionRef) return;
  //   return addDoc(listsCollectionRef, {
  //     ...data,
  //     created: serverTimestamp(),
  //     updated: serverTimestamp(),
  //   });
  // };

  // const update = (data: ListProps) => {
  //   if (!userDocRef || !data.id) return;
  //   const ref = doc(userDocRef, "lists", data.id);
  //   return updateDoc(ref, {
  //     ...data,
  //     updated: serverTimestamp(),
  //   });
  // };

  // const remove = (listId: string) => {
  //   if (!userDocRef || !listId) return;
  //   const ref = doc(userDocRef, "lists", listId);
  //   return deleteDoc(ref);
  // };

  return {
    store,
    storeId,
    loadStore,
    menu,
    generateOrder,
    getOrders,
    orders,
    openSells,
    // getProductById,
    // add,
    // update,
    // remove,
  };
};
