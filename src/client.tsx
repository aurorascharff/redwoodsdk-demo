if (window.location.pathname.startsWith('/user')) {
  import('rwsdk/client').then(({ initClient }) => {
    initClient();
  });
} else {
  const [{ initClientNavigation }, { initRealtimeClient }] = await Promise.all([
    import('rwsdk/client'),
    import('rwsdk/realtime/client'),
  ]);
  const { handleResponse } = initClientNavigation();
  initRealtimeClient({
    handleResponse,
    key: window.location.pathname,
  });
}

export {};
