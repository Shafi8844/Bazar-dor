const apiBases = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function proxyBazarDor(endpoint: string) {
  let lastError: unknown;

  for (const base of apiBases) {
    try {
      const response = await fetch(`${base}${endpoint}`, {
        cache: "force-cache",
        next: { revalidate: 1800 },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      lastError = error;
    }
  }

  return Response.json(
    {
      message: "BazarDor API unavailable",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 502 },
  );
}
