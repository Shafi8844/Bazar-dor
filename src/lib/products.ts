export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
};

const apiBase = "https://openapi.programming-hero.com/api/bazardor";

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${apiBase}${endpoint}`, {
    cache: "force-cache",
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`BazarDor API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function getCategories() {
  return fetchFromApi<Category[]>("/categories");
}

export async function getCategory(slug: string) {
  return fetchFromApi<Category>(`/categories/${slug}`);
}

export async function getProducts(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return fetchFromApi<Product[]>(`/products${query}`);
}

export async function getProductById(id: number | string) {
  return fetchFromApi<Product>(`/products/${id}`);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug || String(item.id) === slug);
  return product ? getProductById(product.id) : null;
}

const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBanglaNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => bnDigits[Number(digit)]);
}

export function formatTaka(value: number) {
  return `${toBanglaNumber(new Intl.NumberFormat("en-US").format(value))} টাকা`;
}

export function unitLabel(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    l: "প্রতি লিটার",
    liter: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };

  return units[unit] || `প্রতি ${unit}`;
}

export function compactUnitLabel(unit: string) {
  return unitLabel(unit).replace("প্রতি ", "");
}

export function changeValue(product: Product) {
  return product.change.pct;
}

export function changeLabel(change: number) {
  if (change > 0) return `▲ ${toBanglaNumber(change.toFixed(1))}%`;
  if (change < 0) return `▼ ${toBanglaNumber(Math.abs(change).toFixed(1))}%`;
  return "— ০.০%";
}

export function marketAverage(product: Product) {
  if (!product.markets.length) return product.today;
  const total = product.markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0);
  return Math.round(total / product.markets.length);
}
