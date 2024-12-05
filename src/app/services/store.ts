/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import {firebaseFirestore} from "../libraries/firebase";

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
  slot: string;
  product: string;
  quantity: number;
};

export async function getStores() {
  const collectionRef = collection(firebaseFirestore, "stores");
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc: any) => ({id: doc.id, ...doc.data()}));
}

export async function getStoreIdBySlug(slug: string) {
  // console.log("slug :", slug);
  if (!slug) return;
  return await getDocumentIdBySlug(slug);
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

export async function generateOrder({
  storeId,
  slot,
  product,
  quantity,
  status = "Pendente",
}: {
  storeId: string;
  slot: string;
  product: string;
  quantity?: number;
  status: string;
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
    slot,
    product,
    status
  };
  if (quantity) docOptions.quantity = quantity;
  await addDoc(ordersCollection, docOptions);
}

  export async function getDocumentIdBySlug(slug: string) {
  // Create a reference to the collection
  const collectionRef = collection(firebaseFirestore, "stores");

  // Query the collection for documents where the 'slug' field matches the given slug
  const q = query(collectionRef, where("slug", "==", slug));

  try {
    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if any documents were returned
    if (!querySnapshot.empty) {
      // Get the document ID of the first matching document
      return querySnapshot.docs[0].id;
    } else {
      // No document with the given slug was found
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter documentos:", error);
    throw error;
  }
}
