const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
};
self.onmessage = async function (event) {
  const {name, method, url, body, options} = event.data;
  try {
    const request = {
      method,
      headers: options?.headers ? {...DEFAULT_HEADERS, ...options.headers} : DEFAULT_HEADERS,
      body: body ? JSON.stringify(body) : body,
      // mode: 'cors' as RequestMode, //Info: due to enable cors in backend, so here is no need to set request mode (20230508 - Tzuhan)
    };
    const response = await fetch(url, request);
    if (response?.ok) {
      const result = await response.json();
      self.postMessage({name, result});
    } else {
      self.postMessage({name, error: response?.statusText});
    }
  } catch (error) {
    self.postMessage({name, error});
  }
};

export {};
