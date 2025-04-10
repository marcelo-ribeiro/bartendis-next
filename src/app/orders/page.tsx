/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/Button";
import { OrderStatus, OrderStatusLabels, useOrders } from "../hooks/useOrders";
import { useStore } from "../hooks/useStore";
import "./style.css";

const getStatusColor = (status: OrderStatus) => {
  console.log("status :", status);
  const statusColor = {
    [OrderStatus.PENDENT]: "bg-white",
    [OrderStatus.STARTED]: "bg-yellow-200",
    [OrderStatus.DONE]: "bg-green-200",
    [OrderStatus.CANCELED]: "bg-red-200",
  };
  return statusColor[status] ?? statusColor[OrderStatus.PENDENT];
};

export default function Orders({ searchParams }: any) {
  const slug = searchParams.slug;
  const { store, storeId, openSells, loadStore } = useStore(slug);
  const { orders, getOrders, changeOrderStatus, closeSlotOrders } = useOrders(
    slug,
    store
  );
  const ordersCurrentLength = useRef(0);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [filteredSlot, setFilteredSlot] = useState("");

  useEffect(() => {
    if (!storeId || !store) return;
    getOrders(storeId);
  }, [getOrders, store, storeId]);

  const slots = useMemo(() => {
    if (!orders) return [];
    const slots = orders.map((order) => order.slot).sort();
    const uniqueSlots = Array.from(new Set(slots));
    return uniqueSlots;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    console.log("orders", orders);
    if (!orders) return null;
    if (filteredSlot === "") return orders;
    console.log("new orders");
    return orders?.filter((order) => order.slot === filteredSlot);
  }, [filteredSlot, orders]);

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

  const handleFilteredSlot = (event: any) => {
    setFilteredSlot(event.target.value);
  };

  const handleSelectStatus = async (orderId: string, status: string) => {
    await changeOrderStatus(orderId, status);
  };

  const getSlotLabel = (filteredSlot: string) => {
    return (
      filteredSlot.charAt(0)?.toUpperCase() +
      filteredSlot.slice(1).replace("-", " ")
    );
  };

  const handleCloseSlot = async (slot: string) => {
    const confirmed = confirm(
      `Todos os pedidos da ${getSlotLabel(slot)} serão removidos.`
    );
    if (!confirmed) return;
    await closeSlotOrders(storeId!, slot);
    setFilteredSlot("");
  };

  return (
    <main className="bg-neutral-200 min-h-svh">
      <section>
        <header className="grid xl:grid-flow-col xl:auto-cols-auto justify-between items-center px-8 py-4 bg-white border-b border-neutral-300">
          <h1 className="font-medium text-lg">{store?.name} - Pedidos</h1>

          <div className=" grid grid-flow-col gap-4 w-full text-sm">
            <div className="grid grid-flow-col gap-2 items-center">
              <span className="font-medium">Filtrar por:</span>
              <select
                className="border border-black/10 rounded-lg px-2 py-1 font-semibold uppercase"
                value={filteredSlot}
                onChange={handleFilteredSlot}
              >
                <option value="">Todas mesas</option>
                {slots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot.replace("-", " ")}
                  </option>
                ))}
              </select>
              {!!filteredSlot && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleCloseSlot(filteredSlot)}
                >
                  Fechar {getSlotLabel(filteredSlot)}
                </Button>
              )}
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
                size="small"
                onClick={handleOpenSells}
              >
                Abrir Novo Caixa
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
                className={`grid gap-4 m-0 p-6 border border-black/20 shadow-lg text-center rounded-2xl ${getStatusColor(
                  order.status
                )}`}
                style={{ alignContent: "start" }}
              >
                <div className="grid grid-flow-col auto-cols-min gap-2 justify-center items-center">
                  <div className="font-medium whitespace-nowrap">
                    Status do pedido:
                  </div>
                  <select
                    className="border border-black/10 rounded-lg px-2 py-1 font-semibold"
                    value={order.status}
                    onChange={(event) =>
                      handleSelectStatus(order.id, event.target.value)
                    }
                  >
                    {Object.entries(OrderStatus).map(([key, value]) => (
                      <option key={key} value={value}>
                        {OrderStatusLabels[value as never]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 grid-flow-col auto-cols-min justify-evenly uppercase">
                  <span className="block text-lg opacity-60 whitespace-nowrap">
                    Pedido #{filteredOrders.length - index}
                  </span>
                  <span className="block text-lg opacity-60 whitespace-nowrap">
                    {new Date(order.created).toLocaleTimeString()}
                    {", "}
                    {new Date(order.created).toLocaleDateString()}
                  </span>
                </div>
                <hr className="border-t border-black/20" />
                <div className="grid gap-1">
                  <div className="text-2xl text-red-600 font-semibold uppercase">
                    {order.slot?.replace("-", " ")}
                  </div>
                  {/* {!!order.quantity && (
                    <div
                      color="dark"
                      className="text-2xl font-semibold opacity-70"
                    >
                      Qtd: {order.quantity}X
                    </div>
                  )} */}
                  <div className="text-2xl font-medium">
                    {!!order.quantity && (
                      <span className="font-semibold">{order.quantity}x</span>
                    )}{" "}
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
