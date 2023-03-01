/* eslint-disable no-console */
self.onmessage = async function (event) {
  const {name, method, url, body, options} = event.data;
  const response = await fetch(url, {
    method,
    headers: options?.headers
      ? options.headers
      : {
          'Content-Type': 'application/json',
        },
    body: body ? JSON.stringify(body) : body,
  });
  const result = await response.json();
  self.postMessage({name, result});
};

export {};
