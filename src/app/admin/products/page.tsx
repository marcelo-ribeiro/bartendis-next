/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/app/components/Button";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage"; // Adicionar funções de storage
import Image from "next/image";
import { useEffect, useState } from "react";
import { Categories } from "../../components/Admin/Categories";
import { TProduct } from "../../hooks/useStore";
import { firebaseFirestore, firebaseStorage } from "../../libraries/firebase";

export default function ProductTable({ searchParams }: any) {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [newProduct, setNewProduct] = useState<TProduct>({
    name: "",
    image: "",
    description: "",
    price: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newImageFile, setNewImageFile] = useState<any>(null); // Para armazenar o arquivo de imagem para novo produto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingImageFile, setEditingImageFile] = useState<any[]>([]); // Para armazenar novos arquivos de imagem ao editar
  const storeId = searchParams.storeId;
  const categoryId = searchParams.categoryId;

  // Função para carregar os produtos da Firestore
  useEffect(() => {
    console.log("storeId", storeId);
    console.log("categoryId", categoryId);

    if (!storeId || !categoryId) return;

    const loadProducts = async () => {
      const querySnapshot = await getDocs(
        collection(
          firebaseFirestore,
          `stores/${storeId}/categories/${categoryId}/products`
        )
      );
      console.log("querySnapshot :", querySnapshot);
      setProducts(() => {
        const products = querySnapshot.docs.map((doc: any) => {
          const data = { id: doc.id, ...doc.data() };
          return data;
        });
        console.log("products :", products);
        return products;
      });
    };
    loadProducts();
  }, [storeId, categoryId]);

  useEffect(() => {
    console.log("products :", products);
  }, [products]);

  // Função para adicionar novo produto com imagem
  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price) {
      try {
        // Primeiro cria o documento para obter o ID do produto
        const docRef = await addDoc(
          collection(
            firebaseFirestore,
            `stores/${storeId}/categories/${categoryId}/products`
          ),
          {
            ...newProduct,
            image: "", // O campo de imagem será atualizado após o upload
          }
        );

        let imageUrl = "";

        // Verifica se há imagem para upload
        if (newImageFile) {
          const imageRef = ref(
            firebaseStorage,
            `stores/${storeId}/products/${docRef.id}/${newImageFile.name}`
          );
          await uploadBytes(imageRef, newImageFile);
          imageUrl = await getDownloadURL(imageRef);
        }

        // Atualiza o documento com a URL da imagem
        await setDoc(
          docRef,
          { ...newProduct, image: imageUrl },
          { merge: true }
        );

        // Atualiza o estado local com o novo produto
        setProducts([
          ...products,
          { ...newProduct, id: docRef.id, image: imageUrl },
        ]);
        setNewProduct({ name: "", image: "", description: "", price: 0 });
        setNewImageFile(null); // Resetar o arquivo de imagem
      } catch (error) {
        console.error("Erro ao adicionar o produto:", error);
      }
    } else {
      alert("Nome e Preço são obrigatórios!");
    }
  };

  // Função para atualizar um produto
  const handleUpdateProduct = async (index: number) => {
    const product = products[index];
    const productRef = doc(
      firebaseFirestore,
      `stores/${storeId}/categories/${categoryId}/products/${product.id}`
    );
    console.log("productRef :", productRef);

    try {
      let imageUrl = product.image; // Manter a URL atual da imagem

      // Se o usuário carregar uma nova imagem, faça o upload e atualize a URL
      console.log("editingImageFile[index] :", editingImageFile[index]);
      if (editingImageFile[index]) {
        const imageRef = ref(
          firebaseStorage,
          `stores/${storeId}/products/${product.id}/${editingImageFile[index].name}`
        );
        await uploadBytes(imageRef, editingImageFile[index]);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Atualizar o Firestore com os novos dados
      await updateDoc(productRef, {
        name: product.name,
        description: product.description,
        price: product.price,
        image: imageUrl ?? "", // Atualiza a imagem se for necessário
      });

      // Atualizar o estado local para remover a imagem do produto
      const updatedProducts = [...products];
      updatedProducts[index].image = imageUrl;
      setProducts(updatedProducts);

      // Resetar o estado de arquivo de imagem após atualização
      const updatedFiles = [...editingImageFile];
      updatedFiles[index] = null;
      setEditingImageFile(updatedFiles);

      alert("Produto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
    }
  };

  // Função para remover um produto e deletar a pasta no Storage
  const handleRemoveProduct = async (index: number) => {
    if (!confirm("O produto será excluído.")) return;

    const product = products[index];
    const productRef = doc(
      firebaseFirestore,
      `stores/${storeId}/categories/${categoryId}/products/${product.id}`
    );

    try {
      // Listar e deletar todos os arquivos na pasta do produto no Firebase Storage
      const folderRef = ref(
        firebaseStorage,
        `stores/${storeId}/products/${product.id}`
      );
      const fileList = await listAll(folderRef);

      for (const file of fileList.items) {
        await deleteObject(file);
      }

      // Remover o produto do Firestore
      await deleteDoc(productRef);

      // Atualizar o estado local para remover o produto da lista
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);

      alert("Produto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover o produto:", error);
    }
  };

  // Função para lidar com o upload de uma nova imagem ao editar um produto
  const handleEditImageUpload = (e: any, index: number) => {
    const file = e.target.files[0];
    const updatedFiles = [...editingImageFile];
    updatedFiles[index] = file; // Armazena a nova imagem para o produto em edição
    setEditingImageFile(updatedFiles);
  };

  // Função para lidar com upload de imagem no novo produto
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    setNewImageFile(file);
  };

  // Atualizar estado ao editar campos
  const handleInputChange = (e: any, index: any, field: any) => {
    const updatedProducts: any = [...products];
    updatedProducts[index][field] = e.target.value;
    setProducts(updatedProducts);
  };

  const handleNewProductChange = (e: any, field: any) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleRemoveImage = async (index: number) => {
    const product = products[index];
    if (!product.image) return;

    if (!confirm("A imagem será excluída.")) return;

    console.log("product.image :", product.image);
    const productImage = new URL(decodeURIComponent(product.image)).pathname
      .split("/")
      .pop();
    const url = `stores/${storeId}/products/${product.id}/${productImage}`;
    console.log("url :", url);
    const imageRef = ref(firebaseStorage, url);

    try {
      // Remover a imagem do Firebase Storage
      await deleteObject(imageRef);

      // Atualizar o produto no Firestore para remover a URL da imagem
      const productRef = doc(
        firebaseFirestore,
        `stores/${storeId}/categories/${categoryId}/products/${product.id}`
      );
      await updateDoc(productRef, { image: "" });

      // Atualizar o estado local para remover a imagem do produto
      const updatedProducts = [...products];
      updatedProducts[index].image = "";
      setProducts(updatedProducts);

      alert("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover a imagem:", error);
    }
  };

  return (
    <main>
      <section>
        <div className="px-8 pt-8 pb-4">
          <h1 className="text-3xl font-semibold">Produtos</h1>
        </div>
        <div className="px-8 py-4">
          <Categories />
        </div>
        <div className="p-8">
          <table className="w-full min-w-full text-sm border border-slate-200">
            <thead>
              <tr>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2 w-auto">Imagem</th>
                <th className="px-3 py-2 w-[30%]">Descrição</th>
                <th className="px-3 py-2 w-auto">Preço</th>
                <th className="px-3 py-2 w-auto">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Linha para adicionar novo produto */}
              <tr>
                <td className="px-3 py-2 border border-y-slate-200">
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => handleNewProductChange(e, "name")}
                    placeholder="Novo Produto"
                  />
                </td>
                <td className="px-3 py-2 border border-y-slate-200">
                  <div className="relative flex gap-2 justify-center items-center">
                    <Button color="light" size="sm">
                      Escolher imagem
                    </Button>
                    <input
                      className="absolute inset-0 opacity-0"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </div>
                </td>
                <td className="px-3 py-2 border border-y-slate-200">
                  <textarea
                    className="w-full leading-tight"
                    value={newProduct.description}
                    onChange={(e) => handleNewProductChange(e, "description")}
                    placeholder="Descrição (opcional)"
                  />
                </td>
                <td className="px-3 py-2 border border-y-slate-200">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold">R$</span>
                    <input
                      type="number"
                      className="w-24 pl-1 pr-1 py-1"
                      value={newProduct.price}
                      onChange={(e) => handleNewProductChange(e, "price")}
                      placeholder="Preço"
                    />
                  </div>
                </td>
                <td className="px-4 py-2 border border-y-slate-200 text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    onClick={handleAddProduct}
                  >
                    Adicionar produto
                  </Button>
                </td>
              </tr>

              <tr>
                <td className="px-3 py-2 border border-y-slate-200">&nbsp;</td>
              </tr>

              {products.map((product, index) => (
                <tr key={product.id}>
                  <td className="px-3 py-2 border border-y-slate-200">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleInputChange(e, index, "name")}
                    />
                  </td>
                  <td className="px-4 py-2 border border-y-slate-200 text-center">
                    {!!product?.image ? (
                      <div className="flex gap-2 justify-center items-center">
                        <Image
                          className="inline-flex object-contain w-12 h-12"
                          src={product.image}
                          alt={product.name}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="relative flex gap-2 justify-center items-center">
                        <Button color="outline" size="sm">
                          Escolher imagem
                        </Button>
                        <input
                          className="absolute inset-0 opacity-0"
                          type="file"
                          onChange={(e) => handleEditImageUpload(e, index)}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 border border-y-slate-200">
                    <textarea
                      className="w-full leading-tight"
                      value={product.description || ""}
                      onChange={(e) =>
                        handleInputChange(e, index, "description")
                      }
                    />
                  </td>
                  <td className="px-3 py-2 border border-y-slate-200 whitespace-nowrap">
                    <div className="flex gap-1 items-center">
                      <span className="font-bold">R$</span>
                      <input
                        type="number"
                        className="w-24 pl-1 pr-1 py-1"
                        value={product.price}
                        onChange={(e) => handleInputChange(e, index, "price")}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-y-slate-200 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        color="outline"
                        onClick={() => handleUpdateProduct(index)}
                      >
                        Salvar Produto
                      </Button>
                      <Button
                        size="sm"
                        color="outline"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        Excluir Produto
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
