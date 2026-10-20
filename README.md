# zoorik.com

The source of [zoorik.com](https://zoorik.com), the website of Zoorik. Zoorik reduces cloud cost
autonomously: [Coral](https://zoorik.com/coral) optimizes Kubernetes on AKS and EKS, and
[Amoeba](https://zoorik.com/amoeba) optimizes block storage on Windows and Linux VMs, on Azure and
AWS.

The site is built with [Next.js](https://nextjs.org) and served by
[OpenNext](https://opennext.js.org/cloudflare) on Cloudflare Workers. Every page is prerendered at
build. Plain CSS sheets in `src/styles/` give the site its look.

## Run it

You need Node.js 22.

```sh
npm ci
npm run dev
```

The site opens at http://localhost:3000.

## Check a change

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

To serve the production build on the Workers runtime, as the live site runs it:

```sh
npm run preview
```

## Where things are

| Path | What it holds |
|---|---|
| `src/app/` | One folder per page (its route, metadata and structured data), plus `sitemap.ts` and `robots.ts` |
| `src/content/` | The words each page prints |
| `src/content/learn/articles/` | One file per Learn article, named by its slug; a new file is a new page at `/learn/<slug>` |
| `src/features/learn/figures/` | Each Learn article's own diagrams, one module per diagram, imported by its article |
| `scripts/` | `gen-learn-index.mjs`, which lists the Learn articles before dev, typecheck, test and build; `learn-from-draft.mjs`, which writes an article and its diagrams from its draft; and `gen-authors.mjs`, which writes `src/content/authors.ts`; the last two share `curly-quotes.mjs` |
| `src/features/` | Each page's sections and their tests |
| `src/components/` | Parts shared across pages: the header, marks and buttons |
| `src/styles/` | The site's sheets |
| `src/edge/` | The Worker code that serves the films' byte ranges |
| `public/` | Files served as they are: films, posters, PDFs and share cards |

## Deploy

A merge to `main` deploys the site. The [deploy workflow](.github/workflows/deploy.yml) runs the
typecheck and lint, builds the OpenNext bundle and deploys it to Cloudflare Workers.

## Contributing

Issues and pull requests are welcome. Run the checks above before you open a pull request.

To report a security issue, follow [zoorik.com/security](https://zoorik.com/security) or
[security.txt](https://zoorik.com/.well-known/security.txt). Please don't open a public issue
for it.

## Licence

The code is licensed under the [Apache License 2.0](LICENSE). The Zoorik, Coral and Amoeba names
and marks, and the site's content (its text, films, images and PDFs), are not covered by the
licence; see [NOTICE](NOTICE).
