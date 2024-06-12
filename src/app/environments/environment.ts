export const environment = {
  //@ts-expect-error // Ignore this line
  API_URL: window['env']['apiUrl'] || 'http://localhost:8080',
  storageSecret: 'superSecretoProduction',
};
