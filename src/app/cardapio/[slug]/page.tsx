/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-async-client-component */

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
  const store = await loadStore(storeId!);
  const menu = await getMenu(storeId!);

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
                            searchParams={{ slug, slot }}
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
    </main>
  );
}

export async function generateStaticParams() {
  const stores = await getStores();
  const storesIds = stores.map(({ slug }) => ({ slug }));
  return storesIds;
}
