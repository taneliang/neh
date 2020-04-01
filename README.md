# neh

[![CircleCI](https://circleci.com/gh/taneliang/neh.svg?style=svg)](https://circleci.com/gh/taneliang/neh)
[![codecov](https://codecov.io/gh/taneliang/neh/branch/master/graph/badge.svg)](https://codecov.io/gh/taneliang/neh)
[![Maintainability](https://api.codeclimate.com/v1/badges/a17d9aa41c5fe1ee3dfb/maintainability)](https://codeclimate.com/github/taneliang/neh/maintainability)

<https://neh.eltan.net>

A tool that redirects you; intended to be an Alfred for your browser.

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
- Find the Yarnpkg.com package which corresponds to an NPM package: [npm p https://yarnpkg.com/en/package/react](https://neh.eltan.net/npm%20p%20https://yarnpkg.com/en/package/react)
- Convert a Google search to an NPM package: [npm p https://www.google.com/search?q=react](https://neh.eltan.net/npm%20p%20https://www.google.com/search?q=react)
- Search DuckDuckGo for a Yarn package: [d https://yarnpkg.com/en/package/react](https://neh.eltan.net/d%20https://yarnpkg.com/en/package/react)

Neh! Liddat only. Easy.

## Dev setup

We use Cloudflare's [Wrangler](https://github.com/cloudflare/wrangler) tool to
run and publish neh.

Create a wrangler.toml file with appropriate configuration. Here's a template:

```
name = "neh"
type = "webpack"
webpack_config = "./webpack.config.js"
zone_id = ""
private = false
account_id = ""
route = ""
workers_dev = true
```

Install dependencies with Yarn.

```
yarn
```

To
[preview](https://developers.cloudflare.com/workers/quickstart/#preview-your-project)
neh in development, run:

```
yarn start
```

To publish neh to Cloudflare Workers, run:

```
yarn run publish
```
