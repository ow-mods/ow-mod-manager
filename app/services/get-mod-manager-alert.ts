export type ModManagerAlert = {
  enabled: boolean;
  message: string;
};

export async function getModManagerAlert(
  url: string
): Promise<ModManagerAlert> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.statusText} (${response.status})`);
  }

  return (await response.json()) as ModManagerAlert;
}
