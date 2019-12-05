import { Handler, FunctionHandler, CommandHandler, Token } from './Handler';

const docstring =
  'Are you in the right headspace to receive information that could possibly hurt you?';
const tokens = ['token1', 'token2'];

describe(FunctionHandler, () => {
  test('should passthrough docstring', () => {
    const mockHandlerFn = jest.fn();
    const handler = new FunctionHandler(docstring, mockHandlerFn);
    expect(handler.docstring).toEqual(docstring);
  });

  test('should execute function with tokens when handle is called', async () => {
    const mockHandlerFn = jest.fn();
    const handler = new FunctionHandler(docstring, mockHandlerFn);
    await handler.handle(tokens);
    expect(mockHandlerFn).toBeCalledWith(tokens);
  });
});

describe(CommandHandler, () => {
  // TODO: Write this test when docstring is correctly generated
  test.todo('should generate docstring');

  describe('handle', () => {
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

    function expectHandlingByOnly(handler: MockHandlerWrapper, tokens: Token[]) {
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
      const handler = new CommandHandler(docstring);
      handler.addHandler(handler1.command, handler1.handler);
      handler.addHandler(handler2.command, handler2.handler);

      await handler.handle([handler1.command, ...tokens]);
      expectHandlingByOnly(handler1, tokens);
      await handler.handle([handler2.command, ...tokens]);
      expectHandlingByOnly(handler2, tokens);
    });

    test('should call nothing handler if no tokens', async () => {
      const handler = new CommandHandler(docstring);
      handler.addHandler(handler1.command, handler1.handler);
      handler.setNothingHandler(nothingHandler.handler);
      handler.setDefaultHandler(defaultHandler.handler);

      await handler.handle([]);
      expectHandlingByOnly(nothingHandler, []);
    });

    test('should call default handler if no handler assigned to command', async () => {
      const handler = new CommandHandler(docstring);
      handler.addHandler(handler1.command, handler1.handler);
      handler.setNothingHandler(nothingHandler.handler);
      handler.setDefaultHandler(defaultHandler.handler);

      await handler.handle(tokens);
      expectHandlingByOnly(defaultHandler, tokens);
    });

    test.todo('should return generic response if no applicable handler');
  });
});
