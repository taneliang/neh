import { redirect } from './util';

export type DocString = string;
export type DocObject = { [command: string]: DocType };
export type DocType = DocString | DocObject;
export const DEFAULT_HANDLER_KEY = '$$$default_handler$$$';
export const NOTHING_HANDLER_KEY = '$$$nothing_handler$$$';

export type Token = string;

export type HandlerFn = (tokens: Token[]) => Response | Promise<Response>;

export abstract class Handler {
  abstract readonly doc: DocType;
  abstract handle(tokens: Token[]): Promise<Response>;
}

export class FunctionHandler extends Handler {
  doc: DocString;

  private handlerFn: HandlerFn;

  constructor(docstring: DocString, handlerFn: HandlerFn) {
    super();
    this.doc = docstring;
    this.handlerFn = handlerFn;
  }

  async handle(tokens: Token[]): Promise<Response> {
    return await this.handlerFn(tokens);
  }
}

export class RedirectHandler extends FunctionHandler {
  constructor(docstring: DocString, targetUrl: string) {
    super(docstring, () => redirect(targetUrl));
  }
}

export class CommandHandler extends Handler {
  private handlers: { [command: string]: Handler } = {};
  private defaultHandler?: Handler;
  private nothingHandler?: Handler;

  get doc(): DocObject {
    const docObject: DocObject = Object.fromEntries(
      Object.entries(this.handlers)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([command, handler]) => [command, handler.doc]),
    );
    if (this.defaultHandler) {
      docObject[DEFAULT_HANDLER_KEY] = this.defaultHandler.doc;
    }
    if (this.nothingHandler) {
      docObject[NOTHING_HANDLER_KEY] = this.nothingHandler.doc;
    }
    return docObject;
  }

  addHandler(command: string, handler: Handler): void {
    this.handlers[command] = handler;
  }

  setDefaultHandler(handler: Handler): void {
    this.defaultHandler = handler;
  }

  setNothingHandler(handler: Handler): void {
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
      'Idk what to do with your command. Try checking <a href="/list">list</a>?',
      {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      },
    );
  }
}
