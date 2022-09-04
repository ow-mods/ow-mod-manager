import { uniqueId } from 'lodash';

const measurementProtocolSecret = 'TODO';

const measurementId = `G-2QQN7V5WE1`;

const sessionId = uniqueId();

export const sendInstallEvent = (modUniqueName: string) => {
  fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${process.env.MEASUREMENT_PROTOCOL_SECRET}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: sessionId,
        timestamp_micros: new Date().valueOf() * 1000,
        non_personalized_ads: true,
        events: [
          {
            name: 'mod_install',
            params: {
              mod_unique_name: modUniqueName,
            },
          },
        ],
      }),
    }
  );
};
