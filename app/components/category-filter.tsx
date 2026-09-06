"use client";

export default function CategoryFilter({ categories, activeSlug, onSelect }: any) {

    return (
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0 scroll-smooth items-center">
            <button
                className={`btn btn-sm shrink-0 whitespace-nowrap ${!activeSlug ? "btn-primary" : "btn-outline border-base-300"}`}
                onClick={() => onSelect(undefined)}
            >
                All Products
            </button>
            {categories.map((category: any) => (
                <button
                    key={category.id}
                    className={`btn btn-sm shrink-0 whitespace-nowrap ${activeSlug === category.slug ? "btn-primary" : "btn-outline border-base-300"}`}
                    onClick={() => onSelect(category.slug)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}