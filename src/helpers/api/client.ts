export async function client(
  endpoint: RequestInfo,
  { body, ...customConfig }: any = {}
) {
  const headers = { "Content-Type": "application/json" };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig?.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    return Promise.reject(err.message ?? data);
  }
}

client.get = function (endpoint: RequestInfo, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function (endpoint: RequestInfo, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, body });
};
