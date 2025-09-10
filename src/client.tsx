import { initClient, initClientNavigation } from 'rwsdk/client';
import { initRealtimeClient } from 'rwsdk/realtime/client';

const { handleResponse } = initClientNavigation();
initClient({ handleResponse });
initRealtimeClient({
  key: window.location.pathname,
});
