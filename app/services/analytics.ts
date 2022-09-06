import { uniqueId } from 'lodash';
import { remote } from 'electron';
import { analyticsApiSecret } from './analytics-token';
import { debugConsole } from '../helpers/console-log';

const measurementId = `G-2QQN7V5WE1`;

const sessionId = uniqueId();

type InstallEvent = {
  mod_unique_name: string;
};

type AnalyticsEvent = {
  mod_install: InstallEvent;
  mod_update: InstallEvent;
  mod_required_install: InstallEvent;
  mod_reinstall: InstallEvent;
};

type EventName = keyof AnalyticsEvent;

export const sendEvent = <T extends EventName>(
  eventName: T,
  params: AnalyticsEvent[T]
) => {
  debugConsole.log('analytics event', eventName, params);

  fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${analyticsApiSecret}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: sessionId,
        timestamp_micros: new Date().valueOf() * 1000,
        non_personalized_ads: true,
        events: [
          {
            name: eventName,
            params: {
              ...params,
              manager_version: remote.app.getVersion(),
            },
          },
        ],
      }),
    }
  );
};
