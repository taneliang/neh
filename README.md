# neh

[![CircleCI](https://circleci.com/gh/taneliang/neh.svg?style=svg)](https://circleci.com/gh/taneliang/neh)
[![codecov](https://codecov.io/gh/taneliang/neh/branch/main/graph/badge.svg)](https://codecov.io/gh/taneliang/neh)
[![Maintainability](https://api.codeclimate.com/v1/badges/a17d9aa41c5fe1ee3dfb/maintainability)](https://codeclimate.com/github/taneliang/neh/maintainability)

<https://neh.eltan.net>

A tool that redirects you to some commonly used sites; intended to be an
Alfred for your browser.

![screencast](screenshots/screencast.gif)

Inspired by Facebook's open source [bunny](http://www.bunny1.org) tool, but
rewritten for the cloud serverless edge computing age – neh runs in Cloudflare
Workers on Cloudflare's edge servers located close to you. TL;DR it's fast.

## Usage

The easiest way to use neh is to set <https://neh.eltan.net/> as your
browser's default search engine. Then, run commands by typing their command
names followed by your query. If no command is detected, neh will just redirect
you to DuckDuckGo.

Here are some examples:

- Search YouTube: [yt rickroll](https://neh.eltan.net/yt%20rickroll)
- Go to a GitHub repository: [gh r nusmodifications/nusmods](https://neh.eltan.net/gh%20r%20nusmodifications/nusmods)
- Perform a Google search: [g neh](https://neh.eltan.net/g%20neh)
- Fallback to a DuckDuckGo search: [not a command](https://neh.eltan.net/not%20a%20command)

Neh also does some basic query detection and is able to convert between
different search engines. It's not completely reliable but works in most cases.
Examples:

- Convert a YouTube search to a Wikipedia search: [wk https://www.youtube.com/results?search_query=rickroll](https://neh.eltan.net/wk%20https://www.youtube.com/results?search_query=rickroll)
- Convert a Google search to an NPM package: [npm p https://www.google.com/search?q=react](https://neh.eltan.net/npm%20p%20https://www.google.com/search?q=react)
- Look up an NPM package on BundlePhobia: [bp https://www.npmjs.com/package/react](https://neh.eltan.net/bp%20https://www.npmjs.com/package/react)

Neh! Liddat only. Easy.

## Development

### Setup

We use Cloudflare's [Wrangler](https://github.com/cloudflare/wrangler) tool to
run and publish neh.

1. Run `yarn` to install dependencies.
1. `cp .env.example .env` and fill it in.
1. Modify the wrangler.toml file as appropriate.

### Local development server

To start a local development server, run:

```sh
yarn start
```

You'll then be able to open neh at http://localhost:8787.

### Cloudflare Workers preview

To
[preview](https://developers.cloudflare.com/workers/learning/getting-started#5-preview-your-project)
neh, run:

```sh
yarn preview
```

Wrangler will open the preview in your web browser. If this does not happen,
ensure that the `BROWSER` environmental variable has been set.

## Publishing

Our CircleCI workflow automatically deploys neh's `main` branch to
Cloudflare Workers.

Having said that, here's how you can publish neh manually:

1. Add `CF_API_TOKEN` to your `.env` file.
1. Run:
   ```sh
   yarn env-cmd yarn run publish
   ```
