/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  IonButton,
  IonCard,
  IonContent,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
} from "@ionic/react";
// import "@ionic/react/css/palettes/dark.system.css";
import { useEffect, useMemo, useRef, useState } from "react";
// import { useLocation } from "react-router";
import { useSearchParams } from "next/navigation";
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
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>{store?.name} - Pedidos</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <IonContent fullscreen style={{ "--ion-background-color": "#eee" }}>
        <header className="grid grid-flow-col auto-cols-auto justify-between">
          <IonTitle size="large">{store?.name} - Pedidos</IonTitle>
          <div className=" grid grid-flow-col w-full">
            <div className="grid grid-flow-col gap-2 items-center px-4">
              <span>Filtrar por:</span>
              <IonSelect value={searchFilter} onIonChange={handleSelect}>
                <IonSelectOption value="">Todas mesas</IonSelectOption>
                <IonSelectOption value="mesa-1">Mesa 1</IonSelectOption>
                <IonSelectOption value="mesa-2">Mesa 2</IonSelectOption>
                <IonSelectOption value="mesa-3">Mesa 3</IonSelectOption>
              </IonSelect>
            </div>
            <div className="grid grid-flow-col gap-2 items-center px-4">
              <span>
                Aberto às:{" "}
                {store
                  ? new Date(store.openAt.toMillis()!).toLocaleString()
                  : ""}
              </span>
              <IonButton fill="solid" color="success" onClick={handleOpenSells}>
                Abrir o caixa
              </IonButton>
            </div>
          </div>
        </header>

        <section className={hasNewOrder ? "new-order" : ""}>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3q gap-8 w-full p-8">
            {filteredOrders?.map((order, index) => (
              <IonCard
                key={order.id}
                className={`grid gap-4 m-0 text-center p-6 place-content-center ${getStatusColor(
                  order.status
                )}`}
              >
                <div className="grid grid-flow-col gap-2 items-center">
                  <span>Status do pedido</span>
                  <IonSelect
                    value={order.status ?? orderStatus.pendent}
                    onIonChange={(event) =>
                      handleSelectStatus(order.id, event.detail.value)
                    }
                  >
                    {Object.entries(orderStatus).map(([key, value]) => (
                      <IonSelectOption key={key} value={value}>
                        {value}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>
                <IonText
                  color="medium"
                  className="text-xl opacity-70 uppercase"
                >
                  Pedido #{filteredOrders.length - index}
                  <br />
                  <b>{new Date(order.created).toLocaleString()}</b>
                </IonText>
                <hr />
                <IonText
                  color="danger"
                  className="text-2xl font-bold uppercase"
                >
                  {order.slotName?.replace("-", " ")}
                </IonText>
                <IonText color="dark" className="text-3xl font-bold opacity-90">
                  {order.productName}
                </IonText>
                {!!order.quantity && (
                  <IonText
                    color="dark"
                    className="text-2xl font-bold uppercase opacity-70"
                  >
                    QTD: {order.quantity}x
                  </IonText>
                )}
              </IonCard>
            ))}
          </section>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Orders;
