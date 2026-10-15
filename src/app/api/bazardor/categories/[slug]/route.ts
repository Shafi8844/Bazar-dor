import { proxyBazarDor } from "@/lib/api-proxy";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return proxyBazarDor(`/categories/${slug}`);
}
