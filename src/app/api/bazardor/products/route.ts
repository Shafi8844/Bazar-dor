import { proxyBazarDor } from "@/lib/api-proxy";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  return proxyBazarDor(`/products${category ? `?category=${encodeURIComponent(category)}` : ""}`);
}
