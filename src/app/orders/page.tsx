/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSearchParams } from "next/navigation";
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

const Orders: React.FC = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const { store, storeId, openSells, loadStore } = useStore(slug);
  const { orders, getOrders, changeOrderStatus } = useOrders(slug, store);
  const ordersCurrentLength = useRef(0);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const filteredOrders = useMemo(() => {
    if (!orders) return null;
    if (!orders || searchFilter === "") return orders;
    return orders?.filter((order) => order.slotName === searchFilter);
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
    loadStore(storeId);
    getOrders(storeId!);
  };

  const handleSelect = (event: any) => {
    setSearchFilter(event.detail.value);
  };

  const handleSelectStatus = (orderId: string, status: string) => {
    changeOrderStatus(orderId, status);
  };

  return (
    <main>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>{store?.name} - Pedidos</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <section className="bg-slate-100">
        <header className="grid grid-flow-col auto-cols-auto justify-between">
          <h1>{store?.name} - Pedidos</h1>
          <div className=" grid grid-flow-col w-full">
            <div className="grid grid-flow-col gap-2 items-center px-4">
              <span>Filtrar por:</span>
              <select value={searchFilter} onChange={handleSelect}>
                <option value="">Todas mesas</option>
                <option value="mesa-1">Mesa 1</option>
                <option value="mesa-2">Mesa 2</option>
                <option value="mesa-3">Mesa 3</option>
              </select>
            </div>
            <div className="grid grid-flow-col gap-2 items-center px-4">
              <span>
                Aberto às:{" "}
                {store
                  ? new Date(store.openAt.toMillis()!).toLocaleString()
                  : ""}
              </span>
              <Button variant="primary" onClick={handleOpenSells}>
                Abrir o caixa
              </Button>
            </div>
          </div>
        </header>

        <section className={hasNewOrder ? "new-order" : ""}>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3q gap-8 w-full p-8">
            {filteredOrders?.map((order, index) => (
              <article
                key={order.id}
                className={`grid gap-4 m-0 text-center p-6 place-content-center ${getStatusColor(
                  order.status
                )}`}
              >
                <div className="grid grid-flow-col gap-2 items-center">
                  <span>Status do pedido</span>
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
                <div color="medium" className="text-xl opacity-70 uppercase">
                  Pedido #{filteredOrders.length - index}
                  <br />
                  <b>{new Date(order.created).toLocaleString()}</b>
                </div>
                <hr />
                <div color="danger" className="text-2xl font-bold uppercase">
                  {order.slotName?.replace("-", " ")}
                </div>
                <div color="dark" className="text-3xl font-bold opacity-90">
                  {order.productName}
                </div>
                {!!order.quantity && (
                  <div
                    color="dark"
                    className="text-2xl font-bold uppercase opacity-70"
                  >
                    QTD: {order.quantity}x
                  </div>
                )}
              </article>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
};

export default Orders;
