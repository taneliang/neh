import { handlers } from './handlers';

export async function handleQueryString(queryString: string | null): Promise<Response> {
  if (!queryString) {
    return await handlers.list();
  }

  const tokens = queryString.split(' ');
  const [command, ...otherTokens] = tokens;
  const lowerCommand = command.toLowerCase();

  if (lowerCommand in handlers) {
    return await handlers[lowerCommand](otherTokens);
  }
  return await handlers.d(tokens);
}
