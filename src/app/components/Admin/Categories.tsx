/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseFirestore } from "../../libraries/firebase";
import { Button } from "../Button";

type CategoryProps = { id: string; name: string };

export const Categories = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const searchParams = new URLSearchParams(location.search); // Pegar o ID da loja e categoria da URL
  // const router = useIonRouter(); // Usado para navegação entre páginas
  const storeId = searchParams.get("storeId");
  const categoryId = searchParams.get("categoryId");
  const slug = searchParams.get("slug");

  // Função para carregar as categorias da Firestore
  useEffect(() => {
    const loadCategories = async () => {
      const querySnapshot = await getDocs(
        collection(firebaseFirestore, `stores/${storeId}/categories`)
      );
      setCategories(() => {
        const list: any = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        return list;
      });
    };
    loadCategories();
  }, [storeId]);

  // Função para lidar com a seleção de uma categoria existente
  const handleCategorySelect = (e: any) => {
    const selectedCategoryId = e.target.value;
    if (selectedCategoryId) {
      redirect(selectedCategoryId);
    }
  };

  const redirect = (id: string) => {
    location.href = `/admin/produtos/?storeId=${storeId}&categoryId=${id}&slug=${slug}`; // Redirecionar para a nova categoria
  };

  // Função para cadastrar uma nova categoria e redirecionar para sua URL
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const docRef = await addDoc(
          collection(firebaseFirestore, `stores/${storeId}/categories`),
          { name: newCategory }
        );
        setNewCategory(""); // Resetar o campo de input
        redirect(docRef.id);
      } catch (error) {
        console.error("Erro ao adicionar a categoria:", error);
      }
    } else {
      alert("O nome da categoria não pode estar vazio.");
    }
  };

  return (
    <div className="flex gap-8 justify-between">
      {/* Select para selecionar uma categoria existente */}
      <select
        value={categoryId || ""}
        onChange={handleCategorySelect}
        className="px-1 py-1 border border-slate-300 rounded-lg"
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Input e botão para adicionar uma nova categoria */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Digite a categoria"
          className="px-2 py-1 border border-slate-300 rounded-lg"
        />
        <Button variant="primary" size="small" onClick={handleAddCategory}>
          Adicionar
        </Button>
      </div>
    </div>
  );
};
