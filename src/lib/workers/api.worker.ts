self.onmessage = async function (event) {
  const {type, name, method, headers, url, data} = event.data;
  if (type === 'API') {
    const response = await fetch(url, {
      method,
      headers: headers
        ? headers
        : {
            'Content-Type': 'application/json',
          },
      body: data ? data : JSON.stringify(data),
    });
    const result = await response.json();
    self.postMessage({name, result});
  }
};

export {};
