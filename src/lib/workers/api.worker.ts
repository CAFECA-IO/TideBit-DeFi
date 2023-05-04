self.onmessage = async function (event) {
  const {name, method, url, body, options} = event.data;
  try {
    const request = {
      method,
      headers: options?.headers
        ? options.headers
        : {
            'Content-Type': 'application/json',
          },
      body: body ? JSON.stringify(body) : body,
      mode: 'no-cors' as RequestMode,
    };
    // Deprecated: remove console.log (20230509 - tzuhan)
    // eslint-disable-next-line no-console
    console.log(`HTTP request: url(${url})`, request);
    const response = await fetch(url, request);
    if (response?.ok) {
      const result = await response.json();
      self.postMessage({name, result});
    } else {
      // Deprecated: remove console.log (20230509 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`HTTP Response Code: ${response?.status}`, response);
      self.postMessage({name, error: response?.statusText});
    }
  } catch (error) {
    self.postMessage({name, error});
  }
};

export {};
