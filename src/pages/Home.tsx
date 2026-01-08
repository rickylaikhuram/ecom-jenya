// pages/Home.tsx
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProducts,
  fetchCategories,
  fetchProductsByCategory,
  setCurrentPage,
  setSelectedCategory,
} from "../store/slices/productsSlice";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const formatCategoryName = (slug: string): string => {
  if (slug === "all") return "All Categories";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Home = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    categories,
    selectedCategory,
    loading,
    currentPage,
    totalPages,
  } = useAppSelector((state) => state.products);

  const [categoryNames, setCategoryNames] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (selectedCategory === "all") {
      dispatch(fetchProducts({ page: currentPage }));
    } else {
      dispatch(
        fetchProductsByCategory({
          category: selectedCategory,
          page: currentPage,
        })
      );
    }
  }, [dispatch, selectedCategory, currentPage]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const names: Record<string, string> = {};
    categories.forEach((slug) => {
      names[slug] = formatCategoryName(slug);
    });
    setCategoryNames(names);
  }, [categories]);

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-16 w-16 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Products</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[200px]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryNames[category] || category}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Home;
