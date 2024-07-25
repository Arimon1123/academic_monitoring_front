export const environment = {
  //@ts-expect-error // Ignore this line
  API_URL: window['env']['apiUrl'] || 'http://10.243.41.174:8080',
  storageSecret: 'superSecretoProduction',
};
