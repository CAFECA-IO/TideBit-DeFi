self.onmessage = async function (event) {
  const {name, method, url, body, options} = event.data;
  try {
    const response = await fetch(url, {
      method,
      headers: options?.headers
        ? options.headers
        : {
            'Content-Type': 'application/json',
          },
      body: body ? JSON.stringify(body) : body,
    });
    if (response?.ok) {
      const result = await response.json();
      self.postMessage({name, result});
    } else {
      // eslint-disable-next-line no-console
      console.log(`HTTP Response Code: ${response?.status}`, response);
      self.postMessage({name, error: new Error(response?.statusText)});
    }
  } catch (error) {
    self.postMessage({name, error});
  }
};

export {};
