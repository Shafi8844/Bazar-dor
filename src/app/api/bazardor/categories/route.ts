import { proxyBazarDor } from "@/lib/api-proxy";

export function GET() {
  return proxyBazarDor("/categories");
}
