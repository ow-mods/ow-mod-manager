import { debugConsole } from '../helpers/console-log';

export type ModManagerAlert = {
  enabled: boolean;
  message: string;
};

export async function getModManagerAlert(
  url: string,
): Promise<ModManagerAlert> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.statusText} (${response.status})`);
    }

    return (await response.json()) as ModManagerAlert;
  } catch (error) {
    debugConsole.error(`Failed to get alert: ${error}`);
    return { enabled: false, message: '' };
  }
}
