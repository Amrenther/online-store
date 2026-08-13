import { getProducts, getCategories } from "@/app/actions/product-actions";
import ProductGrid from "@/app/components/product-grid";

const LIMIT = 12;


export default async function Home() {

  const [{ products, nextCursor }, categories] = await Promise.all([
    getProducts({ limit: LIMIT }),
    getCategories(),
  ]);

  return (
    <div>
      <ProductGrid
        initialProducts={products}
        initialCursor={nextCursor}
        categories={categories}
      />
    </div>
  );
}
