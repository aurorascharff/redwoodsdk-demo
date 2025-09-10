import { initClientNavigation } from 'rwsdk/client';
import { initRealtimeClient } from 'rwsdk/realtime/client';

const { handleResponse } = initClientNavigation();

initRealtimeClient({
  handleResponse,
  key: window.location.pathname,
});
