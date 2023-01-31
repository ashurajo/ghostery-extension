import { Client, KeyConfig, Server } from 'ohttp-js';

(async function ohttp() {
  const keyId = 0x01;
  const keyConfig = new KeyConfig(keyId);
  const publicKeyConfig = await keyConfig.publicConfig();

  const encodedRequest = new TextEncoder().encode('Happy');
  const encodedResponse = new TextEncoder().encode('Path');

  const client = new Client(publicKeyConfig);
  const requestContext = await client.encapsulate(encodedRequest);
  const clientRequest = requestContext.request;

  const server = new Server(keyConfig);
  const responseContext = await server.decapsulate(clientRequest);
  console.warn('OHTTP', responseContext.encodedRequest, encodedRequest);

  const serverResponse = await responseContext.encapsulate(encodedResponse);
  const finalResponse = await requestContext.decapsulate(serverResponse);
  console.warn('OHTTP', finalResponse, encodedResponse);
})();
