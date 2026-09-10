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

### End-to-end article release runbook

When the user asks to write, publish, and deploy an article, use this order:

1. Create the Markdown post in `source/_posts/` with valid front matter, a unique
   title, the intended Asia/Shanghai publication time, tags, and a category.
2. Review the post for accidental secrets, private URLs, unsafe HTML, executable
   downloads, and content likely to trigger platform security controls.
3. Run `npm run clean`, `npm run build`, `npm audit`, the blocked-content checks in
   this file, and `git diff --check`.
4. Confirm the expected article HTML exists under `public/<year>/<month>/<day>/` and
   contains the correct title and canonical HTTPS URL.
5. Commit the source changes and push `main` to
   `git@github.com:Longjunzhi/person-hexo.git`.
6. Run `npm run deploy` and confirm the generated commit reaches `master` in
   `git@github.com:Longjunzhi/longjunzhi.github.io.git`.
7. Deploy the same local `public/` build to the production Nginx document root using
   the production procedure below. Do not rebuild between the Pages and production
   deployments.
8. Verify the article and core assets over HTTPS on the live domain. Also verify
   sitemap inclusion, security headers, the apex-domain certificate, and the known
   blocked URLs.

If a step fails, stop the release at that point, preserve the last working production
version, and report the exact failure. Do not claim the article is published merely
because the source repository was pushed.

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

### Current production deployment procedure

The current production host and document root are:

```text
SSH: root@8.148.236.241
Nginx: /www/server/nginx/sbin/nginx
Vhost: /www/server/panel/vhost/nginx/www.pangxuejun.cn.conf
Document root: /www/wwwroot/longjunzhi.github.io
```

The document root is not a Git worktree. Deploy generated files from the local
`public/` directory. Before changing it:

1. Confirm the SSH identity and hostname.
2. Re-read the active vhost and confirm its `root` is still the path above.
3. Check free disk space and create a timestamped compressed backup under
   `/www/backup/codex/person-hexo/`.
4. Preserve server-managed files that are not produced by Hexo, currently including
   `.user.ini`, `ba0015b642d4bd3c078a6079b9354bf7.txt`, and `新建文本`.
5. Synchronize `public/` to the document root with deletion enabled so unpublished
   pages and excluded downloads cannot remain stale, while explicitly excluding the
   preserved server-managed files.
6. Do not recursively change ownership or permissions across the document root as
   part of a routine release. The current server has a mixture of server-managed
   ownership. Set safe permissions only on files transferred by the release.
7. Run `/www/server/nginx/sbin/nginx -t` and reload only after validation succeeds.

Use a dry run before the real synchronization. A representative local command is:

```bash
rsync -rztn --delete --chmod=D755,F644 \
  --exclude='.user.ini' \
  --exclude='ba0015b642d4bd3c078a6079b9354bf7.txt' \
  --exclude='新建文本' \
  public/ root@8.148.236.241:/www/wwwroot/longjunzhi.github.io/
```

Remove `-n` only after reviewing the deletion list and confirming the backup exists.
Do not add `--owner` or `--group`, and do not follow the sync with a broad recursive
`chown` or `chmod`.
If `rsync` is unavailable, do not improvise a broad delete command; use a staged
release directory and an atomic, recoverable switch instead.

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
