import {
  Handler,
  FunctionHandler,
  RedirectHandler,
  CommandHandler,
  Token,
  DEFAULT_HANDLER_KEY,
  NOTHING_HANDLER_KEY,
} from './Handler';

const docstring =
  'Are you in the right headspace to receive information that could possibly hurt you?';
const tokens = ['token1', 'token2'];

describe(FunctionHandler, () => {
  test('should passthrough docstring', () => {
    const mockHandlerFn = jest.fn();
    const handler = new FunctionHandler(docstring, mockHandlerFn);
    expect(handler.doc).toEqual(docstring);
  });

  test('should execute function with tokens when handle is called', async () => {
    const mockHandlerFn = jest.fn();
    const handler = new FunctionHandler(docstring, mockHandlerFn);
    await handler.handle(tokens);
    expect(mockHandlerFn).toBeCalledWith(tokens);
  });
});

describe(RedirectHandler, () => {
  const targetUrl = 'https://eliangtan.com';

  test('should passthrough docstring', () => {
    const handler = new RedirectHandler(docstring, targetUrl);
    expect(handler.doc).toEqual(docstring);
  });

  test('should return a redirection when handle is called', async () => {
    const handler = new RedirectHandler(docstring, targetUrl);
    const response = await handler.handle(tokens);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(targetUrl);
  });
});

describe(CommandHandler, () => {
  type MockHandlerWrapper = {
    command: string;
    mockHandlerFn: jest.Mock;
    handler: Handler;
  };

  function makeMockHandler(command: string): MockHandlerWrapper {
    const mockHandlerFn = jest.fn();
    return {
      command,
      mockHandlerFn,
      handler: new FunctionHandler(docstring, mockHandlerFn),
    };
  }

  let handler1: MockHandlerWrapper;
  let handler2: MockHandlerWrapper;
  let nothingHandler: MockHandlerWrapper;
  let defaultHandler: MockHandlerWrapper;
  let handlers: MockHandlerWrapper[] = [];

  beforeEach(() => {
    handlers = [
      makeMockHandler('h1'),
      makeMockHandler('h2'),
      makeMockHandler('nothing'),
      makeMockHandler('default'),
    ];
    [handler1, handler2, nothingHandler, defaultHandler] = handlers;
  });

  test('should generate doc object', () => {
    const handler = new CommandHandler();

    handler.addHandler(handler1.command, handler1.handler);
    expect(handler.doc).toEqual({
      [handler1.command]: docstring,
    });

    handler.addHandler(handler2.command, handler2.handler);
    expect(handler.doc).toEqual({
      [handler1.command]: docstring,
      [handler2.command]: docstring,
    });

    handler.setNothingHandler(nothingHandler.handler);
    expect(handler.doc).toEqual({
      [handler1.command]: docstring,
      [handler2.command]: docstring,
      [NOTHING_HANDLER_KEY]: docstring,
    });

    handler.setDefaultHandler(defaultHandler.handler);
    expect(handler.doc).toEqual({
      [handler1.command]: docstring,
      [handler2.command]: docstring,
      [NOTHING_HANDLER_KEY]: docstring,
      [DEFAULT_HANDLER_KEY]: docstring,
    });
  });

  describe('handle', () => {
    function expectHandlingByOnly(handler: MockHandlerWrapper, tokens: Token[]): void {
      handlers.forEach((h) => {
        if (h === handler) {
          expect(h.mockHandlerFn).toBeCalledWith(tokens);
        } else {
          expect(h.mockHandlerFn).not.toBeCalled();
        }
        h.mockHandlerFn.mockClear();
      });
    }

    test('should execute function with tokens when handle is called', async () => {
      const handler = new CommandHandler();
      handler.addHandler(handler1.command, handler1.handler);
      handler.addHandler(handler2.command, handler2.handler);

      await handler.handle([handler1.command, ...tokens]);
      expectHandlingByOnly(handler1, tokens);
      await handler.handle([handler2.command, ...tokens]);
      expectHandlingByOnly(handler2, tokens);
    });

    test('should call nothing handler if no tokens', async () => {
      const handler = new CommandHandler();
      handler.addHandler(handler1.command, handler1.handler);
      handler.setNothingHandler(nothingHandler.handler);
      handler.setDefaultHandler(defaultHandler.handler);

      await handler.handle([]);
      expectHandlingByOnly(nothingHandler, []);
    });

    test('should call default handler if no handler assigned to command', async () => {
      const handler = new CommandHandler();
      handler.addHandler(handler1.command, handler1.handler);
      handler.setNothingHandler(nothingHandler.handler);
      handler.setDefaultHandler(defaultHandler.handler);

      await handler.handle(tokens);
      expectHandlingByOnly(defaultHandler, tokens);
    });

    test('should return generic response if no applicable handler', async () => {
      const handler = new CommandHandler();
      handler.setNothingHandler(nothingHandler.handler);

      const response = await handler.handle(tokens);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.headers.get('content-type')?.startsWith('text/html')).toBeTruthy();
    });
  });
});
