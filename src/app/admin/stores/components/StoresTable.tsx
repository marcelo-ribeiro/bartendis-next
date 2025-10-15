"use client";
import { Button } from "@/app/components/Button";
import { firebaseFirestore } from "@/app/libraries/firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Store {
  id: string;
  name: string;
  slug: string;
  open: boolean;
  openAt: Timestamp;
  description?: string;
  address?: string;
  phone?: string;
}

interface StoreStatsProps {
  storeId: string;
}

function StoreStats({ storeId }: StoreStatsProps) {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Count categories
        const categoriesRef = collection(
          firebaseFirestore,
          "stores",
          storeId,
          "categories"
        );
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesCount = categoriesSnapshot.size;

        // Count products across all categories
        let productsCount = 0;
        for (const categoryDoc of categoriesSnapshot.docs) {
          const productsRef = collection(
            firebaseFirestore,
            "stores",
            storeId,
            "categories",
            categoryDoc.id,
            "products"
          );
          const productsSnapshot = await getDocs(productsRef);
          productsCount += productsSnapshot.size;
        }

        // Count orders
        const ordersRef = collection(
          firebaseFirestore,
          "stores",
          storeId,
          "orders"
        );
        const ordersSnapshot = await getDocs(ordersRef);
        const ordersCount = ordersSnapshot.size;

        setStats({
          categories: categoriesCount,
          products: productsCount,
          orders: ordersCount,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="flex space-x-4 text-sm text-gray-500">
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 text-sm text-gray-500">
      <span>{stats.categories} categorias</span>
      <span>{stats.products} produtos</span>
      <span>{stats.orders} pedidos</span>
    </div>
  );
}

export function StoresTable() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

  const toggleStoreStatus = async (storeId: string, currentStatus: boolean) => {
    setUpdatingStatus(storeId);
    try {
      const storeRef = doc(firebaseFirestore, "stores", storeId);
      await updateDoc(storeRef, {
        open: !currentStatus,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating store status:", error);
      alert("Erro ao atualizar status da loja");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return timestamp.toDate().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loja
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estatísticas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criada em
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {store.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      <code className="bg-gray-100 px-1 rounded">
                        /{store.slug}
                      </code>
                    </div>
                    {store.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {store.description}
                      </div>
                    )}
                    {store.address && (
                      <div className="text-sm text-gray-500">
                        📍 {store.address}
                      </div>
                    )}
                    {store.phone && (
                      <div className="text-sm text-gray-500">
                        📞 {store.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStoreStatus(store.id, store.open)}
                    disabled={updatingStatus === store.id}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      store.open
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    } ${
                      updatingStatus === store.id
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {updatingStatus === store.id ? (
                      <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full mr-1"></div>
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          store.open ? "bg-green-600" : "bg-red-600"
                        }`}
                      ></div>
                    )}
                    {store.open ? "Aberta" : "Fechada"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StoreStats storeId={store.id} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(store.openAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/cardapio/${store.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Ver Cardápio
                    </Link>
                    <Link
                      href={`/admin/produtos?storeId=${store.id}&slug=${store.slug}`}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      Produtos
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stores.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">Nenhuma loja encontrada</div>
        </div>
      )}
    </div>
  );
}
