/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-async-client-component */

import Logo from "@/app/assets/logotipo-prime-delicatessen.jpeg";
import CallBartenderButton from "@/app/components/CallBartenderButton";
import { Product } from "@/app/components/Product";
import {
  getDocumentIdBySlug,
  getMenu,
  getStores,
  loadStore,
} from "@/app/services/store";
import Image from "next/image";
import "../style.css";

export default async function Cardapio({
  searchParams,
  params,
}: {
  searchParams: { slot: string };
  params: { slug: string };
}) {
  const { slug } = params;
  const { slot } = searchParams;
  const storeId = await getDocumentIdBySlug(slug);

  if (!storeId) return <div>Essa loja não existe</div>;

  const store = await loadStore(storeId);
  const menu = await getMenu(storeId);
  const enableOrder = false;

  return (
    <main>
      <header className="sticky top-0 z-30 w-full grid h-12 bg-white/80 border-b border-stone-200 backdrop-blur-md">
        <nav className="grid justify-items-center items-center">
          <h1 className="font-semibold text-lg">{store?.name}</h1>
        </nav>
      </header>

      <section className="relative">
        <header className="bg-white">
          <nav className="pt-2 pb-5">
            <div className="logo-wrapper relative flex justify-center w-full h-32">
              <Image
                alt="Prime Delicatessen"
                src={Logo}
                className="object-contain w-32 h-32"
              />
            </div>
            <div className="text-center font-base font-medium px-6">
              Olá! Conheça nosso <b>cardápio</b>
            </div>
          </nav>
        </header>

        <section
          id="menuList"
          className="grid pt-4 pb-8 bg-gray-100 rounded-t-3xl"
        >
          {!!menu &&
            Object.entries(menu)?.map(([categorieName, products], index) => {
              if (Array.isArray(products) && !products.length) {
                return <div key={index}></div>;
              }
              return (
                <div key={index} className="relative grid pt-4">
                  <div className="category px-6 text-xl font-semibold">
                    <span className="pl-1" color="dark">
                      {categorieName}
                    </span>
                  </div>

                  <div className="products scroll-horizontal grid grid-flow-col auto-cols-[10rem] gap-3 px-6 py-3 overflow-x-auto">
                    {!!products &&
                      Array.isArray(products) &&
                      [...products].map((product) => (
                        <div key={product.id}>
                          <Product
                            product={product}
                            searchParams={{ slug, slot }}
                            storeId={storeId!}
                            enableOrder={enableOrder}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </section>
      </section>

      {enableOrder && (
        <footer className="sticky bottom-0">
          <nav>
            <CallBartenderButton
              searchParams={searchParams}
              storeId={storeId!}
            />
          </nav>
        </footer>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const stores = await getStores();
  const storesIds = stores.map(({ slug }) => ({ slug }));
  return storesIds;
}

export const revalidate = false;
