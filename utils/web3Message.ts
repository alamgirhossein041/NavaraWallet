export const createResponseMessage = (
  name: string,
  id: string,
  jsonrpc: string,
  result: any,
  error?: any
) => {
  let data = { id, jsonrpc };
  if (error) {
    data = { ...data, error };
  } else {
    data = { ...data, result };
  }
  return {
    name,
    data,
  };
};
