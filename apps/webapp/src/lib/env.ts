export const env = {
  apiUrl:
    import.meta.env.VITE_API_URL ??
    (() => {
      throw new Error('Missing API URL');
    })(),
  socketUrl:
    import.meta.env.VITE_SOCKET_URL ??
    (() => {
      throw new Error('Missing Socket URL');
    })(),
  messagingAppClientUrl:
    import.meta.env.VITE_MESSAGING_APP_CLIENT_URL ??
    (() => {
      throw new Error('Missing Messaging App Client URL');
    })(),
};
