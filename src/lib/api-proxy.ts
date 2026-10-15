const apiBase = "https://openapi.programming-hero.com/api/bazardor";

export async function proxyBazarDor(endpoint: string) {
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      cache: "force-cache",
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return Response.json(await response.json());
  } catch (error) {
    return Response.json(
      {
        message: "BazarDor API unavailable",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
