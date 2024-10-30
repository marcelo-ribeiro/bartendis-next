/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-async-client-component */

import Image from "next/image";
// import Lottie from "react-lottie";
// import animationData from "../assets/lotties/check.json";
import CallBartenderButton from "../../components/CallBartenderButton";
import { Product } from "../../components/Product";
import { getDocumentIdBySlug, getMenu, loadStore } from "../../services/store";
import "../style.css";

// const defaultOptions = {
//   loop: true,
//   autoplay: true,
//   animationData: animationData,
//   rendererSettings: {
//     preserveAspectRatio: "xMidYMid slice",
//   },
// };

export default async function Cardapio({
  searchParams,
  params,
}: {
  searchParams: { slot: string };
  params: { slug: string };
}) {
  console.log("searchParams :", searchParams);
  console.log("params :", params);
  // const [present, dismiss] = useIonLoading();
  const slug = params.slug;
  // const slot = searchParams.slot;

  const storeId = await getDocumentIdBySlug(slug);
  console.log("storeId :", storeId);
  const store = await loadStore(storeId!);
  console.log("store :", store);
  const menu = await getMenu(storeId!);
  console.log("menu :", menu);

  // getStoreId(slug!).then(async (storeId) => {
  //   if (!storeId) return;
  //   store = await loadStore(storeId);
  //   console.log("store :", store);
  //   menu = await getMenu(storeId);
  //   console.log("menu :", menu);
  // });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const { generateOrder } = useStore(slug!);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const showSuccess = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const lastOrderProduct = useRef<any>();

  // useEffect(() => {
  //   async function init() {
  //     if (!menu || !Object.keys(menu).length) {
  //       present({
  //         message: "Carregando o cardápio...",
  //         duration: 3000,
  //       });
  //     }
  //   }
  //   init();
  //   return () => {
  //     dismiss();
  //   };
  // }, [dismiss, menu, present]);

  return (
    <main>
      <header className="sticky top-0 z-30 w-full grid h-12 bg-white border-b border-stone-200">
        <nav className="grid justify-items-center items-center">
          <h1 className="font-semibold text-lg">{store?.name}</h1>
        </nav>
      </header>

      <section className="relative">
        <header>
          <nav className="pt-4 pb-5">
            <div className="logo-wrapper relative flex justify-center mb-2 w-auto h-28">
              <Image
                alt="Prime Delicatessen"
                src="/logotipo-prime-delicatessen.jpeg"
                className="object-contain"
                // width={300}
                // height={112}
                priority={true}
                fill={true}
              />
            </div>
            <div className="text-center font-base font-semibold px-6">
              <span>Olá! Conheça nosso cardápio.</span>
            </div>
          </nav>
        </header>

        <section id="menuList" className="grid pt-3 pb-6 bg-slate-100">
          {!!menu &&
            Object.entries(menu)?.map(([categorieName, products], index) => {
              if (Array.isArray(products) && !products.length) {
                return <div key={index}></div>;
              }
              return (
                <div key={index} className="relative grid pt-2">
                  <div className="category px-6 text-xl font-semibold">
                    <span className="pl-1" color="dark">
                      {categorieName}
                    </span>
                  </div>

                  <div className="products scroll-horizontal grid grid-flow-col auto-cols-[10rem] gap-2 px-6 py-4 overflow-x-auto">
                    {!!products &&
                      Array.isArray(products) &&
                      [...products].map((product) => (
                        <div key={product.id}>
                          <Product
                            product={product}
                            searchParams={searchParams}
                            storeId={storeId!}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </section>
      </section>

      <footer>
        <nav>
          <CallBartenderButton searchParams={searchParams} storeId={storeId!} />
        </nav>
      </footer>

      <div
        className="fixed inset-0 z-50 grid place-items-center place-content-center bg-white/90 transition-opacity duration-1000"
        style={{
          opacity: showSuccess ? 1 : 0,
          pointerEvents: showSuccess ? "auto" : "none",
        }}
      >
        {showSuccess && (
          <>
            {/* <Lottie options={defaultOptions} width={340} height={340} /> */}
            <div className="mt-4 text-black text-2xl font-bold text-center">
              <span color="success">Seu pedido foi realizado!</span>
              <br />
              {/* {lastOrderProduct.current.quantity
                  ? lastOrderProduct.current.quantity + "x "
                  : ""}
                {lastOrderProduct.current.productName} */}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// export async function generateStaticParams() {
//   const stores = await getStores();
//   console.log("stores :", stores);
//   return stores.map((product) => ({ slug: product.slug }));
// }
