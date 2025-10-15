"use client";
import { Button } from "@/app/components/Button";
import { firebaseFirestore } from "@/app/libraries/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  limit,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalCategories: number;
  recentOrders: number;
}

interface RecentActivity {
  id: string;
  type: "order" | "store" | "product";
  message: string;
  timestamp: Date;
  storeId?: string;
  storeName?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStores: 0,
    activeStores: 0,
    totalProducts: 0,
    totalCategories: 0,
    recentOrders: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load stores
      const storesRef = collection(firebaseFirestore, "stores");
      const storesSnapshot = await getDocs(storesRef);
      const stores = storesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const activeStores = stores.filter((store: any) => store.open).length;

      // Load products and categories across all stores
      let totalProducts = 0;
      let totalCategories = 0;

      for (const store of stores) {
        const categoriesRef = collection(
          firebaseFirestore,
          "stores",
          store.id,
          "categories"
        );
        const categoriesSnapshot = await getDocs(categoriesRef);
        totalCategories += categoriesSnapshot.size;

        // Count products in each category
        for (const categoryDoc of categoriesSnapshot.docs) {
          const productsRef = collection(
            firebaseFirestore,
            "stores",
            store.id,
            "categories",
            categoryDoc.id,
            "products"
          );
          const productsSnapshot = await getDocs(productsRef);
          totalProducts += productsSnapshot.size;
        }
      }

      setStats({
        totalStores: stores.length,
        activeStores,
        totalProducts,
        totalCategories,
        recentOrders: 0, // Will be updated with real data
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🛒";
      case "store":
        return "🏪";
      case "product":
        return "🍔";
      default:
        return "📝";
    }
  };

  const quickActions = [
    {
      title: "Nova Loja",
      description: "Adicionar uma nova loja ao sistema",
      href: "/admin/stores",
      icon: "🏪",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Gerenciar Produtos",
      description: "Ver e editar produtos das lojas",
      href: "/admin/produtos",
      icon: "🍔",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Atualizar Dados",
      description: "Atualizar subcoleções do sistema",
      href: "/admin/update-subcollection",
      icon: "🔄",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="mt-2 text-gray-600">Visão geral do sistema Bartendis</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-8 h-8 text-blue-600"
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
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? "..." : stats.totalStores}
              </p>
              <p className="text-sm text-green-600">
                {isLoading ? "..." : stats.activeStores} abertas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorias</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? "..." : stats.totalCategories}
              </p>
              <p className="text-sm text-gray-500">Total no sistema</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produtos</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? "..." : stats.totalProducts}
              </p>
              <p className="text-sm text-gray-500">Total no cardápio</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? "..." : stats.recentOrders}
              </p>
              <p className="text-sm text-gray-500">Últimas 24h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} text-white p-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Status do Sistema
          </h2>
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sistema</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Firestore</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Conectado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Ativo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Última atualização
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(new Date())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Atividade Recente
        </h2>
        <div className="bg-white rounded-lg shadow border">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <p className="text-gray-600">Nenhuma atividade recente</p>
              <p className="text-sm text-gray-500 mt-2">
                As atividades aparecerão aqui conforme o uso do sistema
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {activity.storeName && (
                          <span className="text-xs text-gray-500">
                            {activity.storeName}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
