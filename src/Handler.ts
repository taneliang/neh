import { simpleRedirect } from './util';

export type Token = string;

export type HandlerFn = (tokens: Token[]) => Response;

export abstract class Handler {
  abstract readonly docstring: string;
  abstract async handle(tokens: Token[]): Promise<Response>;
}

export class FunctionHandler extends Handler {
  docstring: string;

  private handlerFn: HandlerFn;

  constructor(docstring: string, handlerFn: HandlerFn) {
    super();
    this.docstring = docstring;
    this.handlerFn = handlerFn;
  }

  async handle(tokens: Token[]): Promise<Response> {
    return await this.handlerFn(tokens);
  }
}

export class RedirectHandler extends FunctionHandler {
  constructor(docstring: string, targetUrl: string) {
    super(docstring, () => simpleRedirect(targetUrl));
  }
}

export class CommandHandler extends Handler {
  // docstring: string;
  private handlers: { [command: string]: Handler } = {};
  private defaultHandler?: Handler;
  private nothingHandler?: Handler;

  constructor(docstring: string) {
    super();
    // this.docstring = docstring;
  }

  get docstring() {
    // TODO: Fix
    return 'hi';
    // return Object.keys(this.docstrings);
  }

  addHandler(command: string, handler: Handler) {
    this.handlers[command] = handler;
  }

  setDefaultHandler(handler: Handler) {
    this.defaultHandler = handler;
  }

  setNothingHandler(handler: Handler) {
    this.nothingHandler = handler;
  }

  async handle(tokens: Token[]): Promise<Response> {
    if (tokens.length === 0) {
      if (this.nothingHandler) {
        return await this.nothingHandler.handle(tokens);
      }
    } else {
      const [command, ...otherTokens] = tokens;
      const lowerCommand = command.toLowerCase();
      if (lowerCommand in this.handlers) {
        return await this.handlers[lowerCommand].handle(otherTokens);
      }
      if (this.defaultHandler) {
        return await this.defaultHandler.handle(tokens);
      }
    }

    return new Response(
      "Huh what? I'm told I have nothing to do lol. Am I supposed to do something? Send help pls. What's happening? Why am I not doing anything? Should I be doing something? Pretty sure I'm supposed to. I'm so confused. Aaaaaaaaaaa",
    );
  }
}
