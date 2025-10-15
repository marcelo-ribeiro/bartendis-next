"use client";
import { Button } from "@/app/components/Button";
import { firebaseFirestore } from "@/app/libraries/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { StoreForm } from "./components/StoreForm";
import { StoresTable } from "./components/StoresTable";

interface Store {
  id: string;
  name: string;
  slug: string;
  openAt: Timestamp;
  open: boolean;
  description?: string;
  address?: string;
  phone?: string;
}

export default function StoresDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | undefined>();

  useEffect(() => {
    const storesRef = collection(firebaseFirestore, "stores");
    const q = query(storesRef, orderBy("name"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const storesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Store[];
        setStores(storesData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to stores:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingStore(undefined);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStore(undefined);
  };

  const handleNewStore = () => {
    setEditingStore(undefined);
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_auto] justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Lojas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas lojas e seus cardápios online
          </p>
        </div>
        <Button variant="primary" onClick={handleNewStore} disabled={isLoading}>
          + Nova Loja
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h3v3H7V7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total de Lojas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stores.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lojas Abertas</p>
              <p className="text-2xl font-bold text-green-600">
                {stores.filter((store) => store.open).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Lojas Fechadas
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stores.filter((store) => !store.open).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Taxa de Abertura
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stores.length > 0
                  ? Math.round(
                      (stores.filter((store) => store.open).length /
                        stores.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <StoresTable />

      {/* Store Form Modal */}
      <StoreForm
        store={editingStore}
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
