# AGENTS.md

## Project overview

This repository contains the source for a personal static blog built with Hexo 8.
It has no application backend or database. Markdown and theme sources are rendered
to `public/`, then published either to GitHub Pages or to an Nginx server.

## Runtime and package manager

- Use Node.js 20.19.0 or newer.
- Use npm. `package-lock.json` is the only dependency lock file.
- Do not introduce Yarn or regenerate `yarn.lock`.
- Install reproducibly with `npm ci` when the lock file has not changed.
- Use `npm install` only when intentionally changing dependencies.

## Repository map

- `_config.yml`: site identity, canonical URL, permalink, generator, and deploy settings.
- `source/_posts/`: Markdown blog posts.
- `source/<page>/index.md`: standalone pages such as About and Favorites.
- `source/static/`: files copied directly into the generated site.
- `themes/landscape/`: locally maintained EJS and Stylus theme. This is the active
  theme; do not replace it with the npm Landscape package without preserving local
  changes.
- `source/nginx.conf`: Nginx configuration copied into `public/` for server deployment.
- `public/`: generated output. Never edit or commit it directly.
- `.deploy_git/`: temporary checkout used by `hexo deploy`. Never edit or commit it.
- `db.json`: generated Hexo cache. Never edit or commit it.

## Editing guidelines

- Make content changes in `source/`, presentation changes in `themes/landscape/`,
  and site-wide changes in `_config.yml`.
- Preserve UTF-8 filenames and Chinese content.
- Keep valid YAML front matter on every post. Use `published: false` to retain a
  post in source without publishing it.
- Do not publish passwords, tokens, private keys, internal management URLs, admin
  panel paths, or non-public service ports.
- Do not add executable downloads, software cracks, credential tools, upload
  endpoints, inline event handlers, `javascript:` URLs, Flash, or arbitrary iframe
  support.
- Avoid constructing HTML from untrusted strings in browser JavaScript. Prefer DOM
  APIs and `.text()`/`.val()` for text and attribute values.
- Preserve the Content Security Policy unless a change is necessary and verified.
  Prefer self-hosted assets; if an external script is required, use HTTPS and SRI.
- Canonical URLs must remain HTTPS and consistent with the public domain.

## Required verification

For content-only changes, run:

```bash
npm run build
```

For dependency, theme, configuration, or security changes, run:

```bash
npm run clean
npm run build
npm audit
git diff --check
```

After a security-sensitive build, also verify that blocked content was not emitted:

```bash
test ! -e public/static/zhile_agent_po.zip
test ! -e 'public/2022/12/13/goland2021-3破解/index.html'
test ! -e 'public/2022/09/25/科学上网/index.html'
rg -n -i 'javascript:|<iframe|<object|<embed|rabbit-mq\.ali|bt\.wx|bt\.ali|bts\.f' public --glob '!*.pdf'
```

The final `rg` command should produce no matches attributable to published site
content. Investigate any match rather than suppressing it blindly.

For local browser testing, use `npm run server`; the default URL is
`http://localhost:4000/`. Stop the server after testing.

## Git workflow

- Preserve unrelated user changes in a dirty worktree.
- Review `git status` and `git diff` before staging.
- Do not commit `public/`, `.deploy_git/`, `db.json`, `node_modules/`, or secrets.
- Use concise commits that separate content work from dependency/security work when
  practical.
- Do not amend, force-push, reset, or rewrite history unless explicitly requested.

## Publishing

Publishing changes external state. Only deploy or push when the user asks for it.

The source repository is:

```text
git@github.com:Longjunzhi/person-hexo.git (main)
```

Hexo's GitHub Pages target is:

```text
git@github.com:Longjunzhi/longjunzhi.github.io.git (master)
```

Normal GitHub Pages release flow:

```bash
npm run clean
npm run build
npm run deploy
```

Confirm the deploy output names the `master` branch. Do not edit or manually commit
inside `.deploy_git/`.

The public domain currently resolves to a separately managed Nginx server at
`8.148.236.241`, so a GitHub Pages push alone may not update the live domain. Server
deployment requires an explicit user request and successful public-key SSH access.

## Production server safety

- Connect using SSH keys; never request, display, log, or store a password or private
  key in the repository.
- Start with read-only inspection: identity, hostname, running containers/services,
  active Nginx configuration, document root, certificates, and current backups.
- Resolve the exact active document root before copying files.
- Before replacing live files, create a timestamped server-side backup outside the
  document root and confirm available disk space.
- Never delete broad paths, overwrite certificates, modify firewall rules, or restart
  unrelated services.
- Validate Nginx with `nginx -t` before reload. Prefer reload over restart.
- The TLS certificate must cover both `pangxuejun.cn` and `www.pangxuejun.cn`.
- After deployment, verify both domains, `sitemap.xml`, CSS and JavaScript assets,
  security headers, and expected 404 responses for unpublished pages and excluded
  downloads.

## Security incident context

The site has previously been blocked by WeChat as potentially serving malicious or
user-generated content. Treat removal of the following controls as a security
regression:

- unpublished crack and VPN posts;
- exclusion of `static/zhile_agent_po.zip`;
- removal of public administration-panel links;
- removal of legacy Fancybox/Flash/iframe assets;
- current CSP and Nginx hardening headers;
- dependency audit with zero known vulnerabilities.

If WeChat recovery is involved, first prove that the live server—not only local
`public/` or GitHub Pages—serves the corrected build and returns 404 for the removed
URLs. Certificate and DNS issues must be fixed before submitting a recovery request.
