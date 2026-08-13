"use client";

import ProductCard from "@/app/components/product-card";
import CategoryFilter from "@/app/components/category-filter";
import { useState, useRef, useEffect, useTransition } from "react";
import { getProducts } from "@/app/actions/product-actions";

const LIMIT = 12;

export default function ProductGrid({ initialProducts, initialCursor, categories }: any) {

    const [ products, setProducts ] = useState(initialProducts);
    const [ cursor, setCursor ] = useState(initialCursor);
    const [activeCategory, setActiveCategory] = useState(undefined);
    const [ isPending, startTransition ] = useTransition();
    const loaderRef = useRef(null);


    async function loadMore() {
        if (!cursor) return;

        startTransition(async () => {
            const { products:newProducts, nextCursor } = await getProducts({ cursor, limit: LIMIT, categorySlug: activeCategory });
            setProducts((prev: any) => [...prev, ...newProducts]);
            setCursor(nextCursor);
        })
    }

    async function filterProducts(categorySlug: string) {
        startTransition(async () => {
            const { products:newProducts, nextCursor } = await getProducts({ limit: LIMIT, categorySlug });
            setProducts(newProducts);
            setCursor(nextCursor);
        })
    }

    useEffect(() => {
        if (activeCategory) {
            filterProducts(activeCategory);
        } else {
            setProducts(initialProducts);
            setCursor(initialCursor);
        }
    }, [activeCategory]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        })

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [cursor]);

    return (
        <section>
            <CategoryFilter categories={categories} activeSlug={activeCategory} onSelect={setActiveCategory} />
            <div className="grid grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div ref={loaderRef} className="py-10 flex justify-center">
                { isPending && (
                    <span className="loading loading-spinner"></span>
                )}
            </div>
        </section>
    )
}