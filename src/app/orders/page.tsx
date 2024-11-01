/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/Button";
import { useOrders } from "../hooks/useOrders";
import { useStore } from "../hooks/useStore";
import "./style.css";

enum orderStatus {
  pendent = "Pendente",
  ready = "Em preparo",
  done = "Finalizado",
  canceled = "Cancelado",
}

const getStatusColor = (key: string) => {
  const statusColor: any = {
    Pendent: "",
    "Em preparo": "bg-yellow-100",
    Finalizado: "bg-green-100",
    Cancelado: "bg-red-100",
  };
  return statusColor[key] ?? "";
};

export default function Orders({ searchParams }: any) {
  const slug = searchParams.slug;
  const { store, storeId, openSells, loadStore } = useStore(slug);
  const { orders, getOrders, changeOrderStatus } = useOrders(slug, store);
  const ordersCurrentLength = useRef(0);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (!storeId || !store) return;
    getOrders(storeId);
  }, [getOrders, store, storeId]);

  const filteredOrders = useMemo(() => {
    if (!orders) return null;
    if (searchFilter === "") return orders;
    console.log("new orders");

    return orders?.filter((order) => order.slot === searchFilter);
  }, [searchFilter, orders]);

  useEffect(() => {
    // Ignorar a primeira carga
    if (!orders) return;

    if (ordersCurrentLength.current === 0 && orders.length > 0) {
      ordersCurrentLength.current = orders.length;
      return;
    }
    // Função para tocar o som
    const playSound = () => {
      const audio = new Audio("/new-order.mp3"); // Substitua pelo caminho do seu arquivo de som
      audio.play();
    };
    // Exibir alerta se um novo produto for adicionado
    if (orders.length > ordersCurrentLength.current) {
      setHasNewOrder(true);
      setTimeout(() => {
        setHasNewOrder(false);
      }, 4000);
      // Toca o som
      playSound();
    }
    // Atualizar o comprimento anterior da lista de produtos
    ordersCurrentLength.current = orders.length;
  }, [orders]);

  const handleOpenSells = async () => {
    await openSells();
    await loadStore(storeId);
  };

  const handleSelect = (event: any) => {
    setSearchFilter(event.detail.value);
  };

  const handleSelectStatus = (orderId: string, status: string) => {
    changeOrderStatus(orderId, status);
  };

  return (
    <main className="bg-neutral-100 h-lvh">
      <section>
        <header className="grid xl:grid-flow-col xl:auto-cols-auto justify-between items-center px-8 py-4 bg-white border-b border-neutral-300">
          <h1 className="font-medium text-lg">{store?.name} - Pedidos</h1>

          <div className=" grid grid-flow-col gap-4 w-full text-sm">
            <div className="grid grid-flow-col gap-2 items-center">
              <span className="font-medium">Filtrar por:</span>
              <select value={searchFilter} onChange={handleSelect}>
                <option value="">Todas mesas</option>
                <option value="mesa-1">Mesa 1</option>
                <option value="mesa-2">Mesa 2</option>
                <option value="mesa-3">Mesa 3</option>
              </select>
            </div>
            <div className="grid grid-flow-col gap-4 items-center">
              <div>
                <span className="font-medium">Aberto às: </span>
                {store
                  ? new Date(store.openAt.toMillis()!).toLocaleString()
                  : ""}
              </div>
              <Button
                variant="primary"
                fill="outline"
                onClick={handleOpenSells}
              >
                Abrir o caixa
              </Button>
            </div>
          </div>
        </header>

        {!filteredOrders?.length && (
          <div className="font-medium text-3xl text-neutral-600 text-center py-12 px-8 leading-normal">
            O caixa está aberto.
            <br />
            Nenhum pedido realizado.
          </div>
        )}

        <section className={hasNewOrder ? "new-order" : ""}>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3q gap-8 w-full p-8">
            {filteredOrders?.map((order, index) => (
              <article
                key={order.id}
                className={`grid gap-4 m-0 bg-neutral-200 text-center p-6 rounded-xl ${getStatusColor(
                  order.status
                )}`}
              >
                <div className="grid grid-flow-col gap-2 items-center">
                  <span className="font-medium">Status do pedido:</span>
                  <select
                    value={order.status ?? orderStatus.pendent}
                    onChange={(event) =>
                      handleSelectStatus(order.id, event.target.value)
                    }
                  >
                    {Object.entries(orderStatus).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div color="medium" className="text-xl uppercase">
                  <span className="opacity-70">
                    Pedido #{filteredOrders.length - index}
                  </span>
                  <br />
                  <span className="font-semibold">
                    {new Date(order.created).toLocaleString()}
                  </span>
                </div>
                <hr className="border-t border-black/20" />
                <div className="grid gap-2">
                  <div
                    color="danger"
                    className="text-2xl font-semibold uppercase opacity-70"
                  >
                    {order.slot?.replace("-", " ")}
                  </div>
                  {!!order.quantity && (
                    <div
                      color="dark"
                      className="text-2xl font-semibold opacity-70"
                    >
                      Qtd: {order.quantity}X
                    </div>
                  )}
                  <div
                    color="dark"
                    className="text-3xl font-semibold opacity-90"
                  >
                    {order.product}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
}
