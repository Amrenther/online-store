"use client";

export default function CategoryFilter({ categories, activeSlug, onSelect }: any) {

    return (
        <div className="flex gap-2 mb-6">
            <button
                className={`btn btn-sm ${!activeSlug ? "btn-primary" : "btn-ghost"}`}
                onClick={() => onSelect(undefined)}
            >
                All
            </button>
            {categories.map((category: any) => (
                <button
                    key={category.id}
                    className={`btn btn-sm ${activeSlug === category.slug ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => onSelect(category.slug)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}