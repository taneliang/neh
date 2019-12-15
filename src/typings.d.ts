declare module '*.pug' {
  const contents: import('pug').compileTemplate;
  export = contents;
}

declare module '*.txt' {
  const contents: string;
  export = contents;
}

declare module '*.xml' {
  const contents: string;
  export = contents;
}
