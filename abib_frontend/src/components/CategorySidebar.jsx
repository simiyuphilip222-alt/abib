import React from "react";
import "./CategorySidebar.css";

const CATEGORY_GROUPS = [
  {
    group: "Electronics & Gadgets",
    items: [
      {
        name: "Phones & Accessories",
        slug: "phones-accessories",
        aliases: ["phones accessories", "mobile phones", "phone accessories"],
      },
      {
        name: "Computer & Office",
        slug: "computer-office",
        aliases: ["computers office", "office electronics", "computer accessories"],
      },
      {
        name: "Consumer Electronics",
        slug: "consumer-electronics",
        aliases: ["electronics", "gadgets"],
      },
    ],
  },
  {
    group: "Fashion & Apparel",
    items: [
      { name: "Men's Clothing", slug: "mens-clothing", aliases: ["mens fashion"] },
      { name: "Women's Clothing", slug: "womens-clothing", aliases: ["womens fashion"] },
      { name: "Bags & Shoes", slug: "bags-shoes", aliases: ["bags", "shoes"] },
    ],
  },
  {
    group: "Beauty & Personal Care",
    items: [
      {
        name: "Health, Beauty & Hair",
        slug: "beauty-health-hair",
        aliases: ["beauty", "hair", "personal care"],
      },
    ],
  },
  {
    group: "Home & Living",
    items: [
      {
        name: "Home, Garden & Furniture",
        slug: "home-garden-furniture",
        aliases: ["home decor", "furniture"],
      },
      { name: "Home Improvement", slug: "home-improvement", aliases: [] },
    ],
  },
  {
    group: "Kids & Toys",
    items: [
      {
        name: "Toys, Kids & Babies",
        slug: "toys-kids-babies",
        aliases: ["toys", "kids", "babies"],
      },
    ],
  },
  {
    group: "Sports & Fitness",
    items: [
      {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        aliases: ["sports", "fitness", "outdoors"],
      },
    ],
  },
  {
    group: "Automotive",
    items: [
      {
        name: "Automobiles & Motorcycles",
        slug: "automobiles-motorcycles",
        aliases: ["cars", "motorcycles", "automotive"],
      },
    ],
  },
  {
    group: "Jewelry & Accessories",
    items: [
      {
        name: "Jewelry & Watches",
        slug: "jewelry-watches",
        aliases: ["jewelry", "watches"],
      },
    ],
  },
];

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function CategorySidebar({ activeCategory, onFilterChange, onSelect, categories = [] }) {
  const available = Array.isArray(categories) ? categories : [];

  const resolveCategory = (item) => {
    const candidates = [item.name, item.slug, ...(item.aliases || [])].map(normalize);

    const match = available.find((cat) => {
      const normalizedCategory = normalize(cat);
      return candidates.some(
        (candidate) =>
          candidate === normalizedCategory ||
          normalizedCategory.includes(candidate) ||
          candidate.includes(normalizedCategory)
      );
    });

    return match || item.slug;
  };

  const handleSelect = (category) => {
    if (typeof onFilterChange === "function") {
      onFilterChange({
        search: "",
        category,
      });
      return;
    }

    if (typeof onSelect === "function") {
      onSelect(category);
    }
  };

  return (
    <aside className="category-sidebar">
      <div className="category-sidebar__title">Categories</div>

      <div className="category-sidebar__list">
        <button
          type="button"
          className={`category-sidebar__item ${!activeCategory ? "is-active" : ""}`}
          onClick={() => handleSelect("")}
        >
          All Products
        </button>

        {CATEGORY_GROUPS.map((group) => (
          <div key={group.group} className="category-sidebar__group">
            <div className="category-sidebar__group-title">{group.group}</div>

            {group.items.map((item) => {
              const value = resolveCategory(item);

              return (
                <button
                  key={item.slug}
                  type="button"
                  className={`category-sidebar__item ${
                    activeCategory === value ? "is-active" : ""
                  }`}
                  onClick={() => handleSelect(value)}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default CategorySidebar;
