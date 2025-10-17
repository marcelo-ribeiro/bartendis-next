import Logo from "@/app/assets/logotipo-prime-delicatessen.jpeg";
import CallBartenderButton from "@/app/components/CallBartenderButton";
import { CardapioClient } from "./CardapioClient";
import {
  getDocumentIdBySlug,
  getMenu,
  getStores,
  loadStore,
} from "@/app/services/store";
import Image from "next/image";
import "../style.css";

export default async function Cardapio(props: {
  searchParams: Promise<{ slot: string }>;
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const storeId = await getDocumentIdBySlug(slug);
  if (!storeId) return <div>Essa loja não existe</div>;

  const searchParams = await props.searchParams;
  const { slot } = searchParams;
  const store = await loadStore(storeId);
  const menu = await getMenu(storeId);
  const enableOrder = !!slot;

  return (
    <main>
      <header className="sticky top-0 z-30 grid w-full h-10 bg-white border-b border-black/10">
        <nav className="grid justify-items-center items-center">
          <h1 className="font-semibold text-base">{store?.name}</h1>
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
              Olá! Conheça nosso cardápio
            </div>
          </nav>
        </header>

        <CardapioClient
          menu={menu}
          storeId={storeId}
          searchParams={{ slug, slot }}
          enableOrder={enableOrder}
        />
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const stores = await getStores();
  const storesIds = stores.map(({ slug }) => ({ slug }));
  return storesIds;
}

export const revalidate = false;
