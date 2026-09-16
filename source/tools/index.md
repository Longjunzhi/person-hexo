---
title: 在线工具
date: 2026-09-10 12:00:00
comments: false
sidebar: false
hide_author: true
---

<div class="tools-shell">
  <aside class="tools-nav" aria-label="工具选择">
    <div class="tools-nav-heading">我的工具箱</div>
    <div class="tools-nav-list" role="tablist" aria-orientation="vertical">
      <button id="tool-tab-data" class="tools-nav-item is-active" type="button" role="tab" data-tool-target="data-formatter" aria-controls="data-formatter" aria-selected="true">
        <span class="tools-nav-icon" aria-hidden="true">{ }</span>
        <span><strong>数据格式化</strong><small>JSON / Python 字典</small></span>
      </button>
      <button id="tool-tab-time" class="tools-nav-item" type="button" role="tab" data-tool-target="timestamp-converter" aria-controls="timestamp-converter" aria-selected="false">
        <span class="tools-nav-icon" aria-hidden="true">⏱</span>
        <span><strong>时间戳转换</strong><small>秒 / 毫秒 / 日期</small></span>
      </button>
      <button id="tool-tab-color" class="tools-nav-item" type="button" role="tab" data-tool-target="color-blocks" aria-controls="color-blocks" aria-selected="false">
        <span class="tools-nav-icon tools-nav-color-icon" aria-hidden="true">▦</span>
        <span><strong>色块工具</strong><small>色阶 / CSS 变量</small></span>
      </button>
      <button id="tool-tab-url" class="tools-nav-item" type="button" role="tab" data-tool-target="url-codec" aria-controls="url-codec" aria-selected="false">
        <span class="tools-nav-icon" aria-hidden="true">URL</span>
        <span><strong>URL 编解码</strong><small>编码 / Query 参数</small></span>
      </button>
      <button id="tool-tab-base64" class="tools-nav-item" type="button" role="tab" data-tool-target="base64-unicode" aria-controls="base64-unicode" aria-selected="false">
        <span class="tools-nav-icon" aria-hidden="true">64</span>
        <span><strong>Base64 / Unicode</strong><small>文本双向转换</small></span>
      </button>
      <button id="tool-tab-utf8" class="tools-nav-item" type="button" role="tab" data-tool-target="utf8-codec" aria-controls="utf8-codec" aria-selected="false">
        <span class="tools-nav-icon" aria-hidden="true">UTF</span>
        <span><strong>UTF-8 编码转换</strong><small>字节 / 转义 / URL</small></span>
      </button>
      <button id="tool-tab-sql" class="tools-nav-item" type="button" role="tab" data-tool-target="sql-formatter" aria-controls="sql-formatter" aria-selected="false">
        <span class="tools-nav-icon" aria-hidden="true">SQL</span>
        <span><strong>SQL 格式化</strong><small>缩进 / 压缩</small></span>
      </button>
      <button id="tool-tab-rsa" class="tools-nav-item" type="button" role="tab" data-tool-target="rsa-key-generator" aria-controls="rsa-key-generator" aria-selected="false">
        <span class="tools-nav-icon" aria-hidden="true">RSA</span>
        <span><strong>RSA 公私钥生成</strong><small>PKCS#8 / PKCS#1</small></span>
      </button>
    </div>
    <div class="tools-nav-note">所有数据仅在本机浏览器处理，不会上传服务器。</div>
  </aside>

  <main class="tools-workspace">
    <section id="data-formatter" class="tool-panel is-active" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-data">
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">FORMATTER</span><h2>JSON / Python 字典互转</h2><p>自动识别并格式化，也可在 JSON 与 Python 字典之间双向转换。</p></div>
        <span class="tool-local-badge">本地处理</span>
      </header>
      <div class="tool-grid tool-grid-editor">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="data-input">输入内容</label><span>JSON / Python</span></div>
          <textarea id="data-input" spellcheck="false" placeholder='粘贴 JSON，或 Python 字典：{"name": "军的小屋", "enabled": True, "value": None}'></textarea>
        </div>
        <div class="tool-field tool-output-field">
          <div class="tool-field-heading"><span class="tool-field-label">转换结果</span><span id="data-output-format">标准 JSON · 语法高亮</span></div>
          <pre id="data-highlight-output" class="json-highlight-output" tabindex="0" aria-label="格式化结果"><span class="json-placeholder">解析结果会自动显示在这里</span></pre>
          <textarea id="data-output" hidden readonly aria-hidden="true"></textarea>
        </div>
      </div>
      <div class="tool-panel-footer">
        <div class="tool-actions">
          <button id="format-data" class="tool-button primary" type="button">格式化</button>
          <button id="compact-data" class="tool-button" type="button">压缩</button>
          <button id="json-to-python" class="tool-button" type="button">JSON → Python 字典</button>
          <button id="python-to-json" class="tool-button" type="button">Python 字典 → JSON</button>
          <button id="copy-data" class="tool-button" type="button">复制结果</button>
          <button id="clear-data" class="tool-button subtle" type="button">清空</button>
        </div>
        <div id="data-status" class="tool-status" role="status" aria-live="polite"></div>
      </div>
    </section>
    <section id="timestamp-converter" class="tool-panel" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-time" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">TIME CONVERTER</span><h2>时间戳转换</h2><p>秒、毫秒时间戳与本地日期时间双向转换。</p></div>
        <span class="tool-local-badge">自动识别</span>
      </header>
      <div class="tool-grid tool-grid-time">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="timestamp-input">时间戳</label><span>秒 / 毫秒</span></div>
          <input id="timestamp-input" type="text" inputmode="numeric" placeholder="例如：1757476800 或 1757476800000">
        </div>
        <div class="tool-field">
          <div class="tool-field-heading"><label for="datetime-input">本地日期时间</label><span>当前时区</span></div>
          <input id="datetime-input" type="datetime-local" step="1">
        </div>
      </div>
      <div class="tool-actions">
        <button id="timestamp-now" class="tool-button primary" type="button">当前时间</button>
        <button id="timestamp-convert" class="tool-button" type="button">时间戳转日期</button>
        <button id="datetime-convert" class="tool-button" type="button">日期转时间戳</button>
        <button id="copy-timestamp" class="tool-button" type="button">复制毫秒时间戳</button>
      </div>
      <dl class="time-result">
        <div><dt>本地时间</dt><dd id="time-local">-</dd></div>
        <div><dt>UTC / ISO 8601</dt><dd id="time-utc">-</dd></div>
        <div><dt>秒时间戳</dt><dd id="time-seconds">-</dd></div>
        <div><dt>毫秒时间戳</dt><dd id="time-milliseconds">-</dd></div>
      </dl>
      <div id="time-status" class="tool-status" role="status" aria-live="polite"></div>
    </section>
    <section id="color-blocks" class="tool-panel tool-panel-color" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-color" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">COLOR PALETTE</span><h2>色块工具</h2><p>选择一个基础色，自动生成可直接用于界面设计的十级色阶。</p></div>
        <span class="tool-local-badge">点击即复制</span>
      </header>
      <div class="color-controls">
        <label class="color-picker-shell" for="color-picker">
          <input id="color-picker" type="color" value="#0284c7" aria-label="选择基础颜色">
          <span>选择颜色</span>
        </label>
        <div class="tool-field color-hex-field">
          <div class="tool-field-heading"><label for="color-hex">HEX 颜色</label><span>支持 3 位或 6 位</span></div>
          <input id="color-hex" type="text" value="#0284C7" maxlength="7" spellcheck="false" autocomplete="off" placeholder="#0284C7">
        </div>
        <button id="random-color" class="tool-button" type="button">随机颜色</button>
        <button id="copy-color-css" class="tool-button primary" type="button">复制 CSS 变量</button>
      </div>
      <div id="color-palette" class="color-palette" aria-label="生成的色阶"></div>
      <div class="color-summary">
        <div><span>基础色</span><strong id="color-base-value">#0284C7</strong></div>
        <div><span>RGB</span><strong id="color-rgb-value">rgb(2, 132, 199)</strong></div>
        <div><span>HSL</span><strong id="color-hsl-value">hsl(200, 98%, 39%)</strong></div>
      </div>
      <div id="color-status" class="tool-status" role="status" aria-live="polite">点击任意色块可复制对应的 HEX 值。</div>
    </section>
    <section id="url-codec" class="tool-panel tool-panel-compact" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-url" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">URL CODEC</span><h2>URL 编解码与 Query 参数</h2><p>对文本进行 URL 组件编解码，或解析、重组查询参数。</p></div>
        <span class="tool-local-badge">本地处理</span>
      </header>
      <div class="tool-grid tool-grid-editor">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="url-input">输入内容</label><span>文本 / URL / Query</span></div>
          <textarea id="url-input" class="tool-textarea-compact" spellcheck="false" placeholder="例如：https://example.com/search?q=中文&tag=Hexo"></textarea>
        </div>
        <div class="tool-field">
          <div class="tool-field-heading"><label for="url-output">转换结果</label><span>可直接编辑</span></div>
          <textarea id="url-output" class="tool-textarea-compact" spellcheck="false" placeholder="结果会显示在这里"></textarea>
        </div>
      </div>
      <div class="tool-actions">
        <button id="url-encode" class="tool-button primary" type="button">编码组件</button>
        <button id="url-decode" class="tool-button" type="button">解码组件</button>
        <button id="url-parse-query" class="tool-button" type="button">解析 Query</button>
        <button id="url-build-query" class="tool-button" type="button">重组 Query</button>
        <button id="url-copy" class="tool-button" type="button">复制结果</button>
        <button id="url-clear" class="tool-button subtle" type="button">清空</button>
      </div>
      <div class="tool-help">Query 解析结果为 JSON 对象；同名参数会保留为数组。重组时请输入 JSON 对象。</div>
      <div id="url-status" class="tool-status" role="status" aria-live="polite"></div>
    </section>
    <section id="base64-unicode" class="tool-panel tool-panel-compact" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-base64" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">TEXT CODEC</span><h2>Base64 / Unicode 转换</h2><p>支持 UTF-8 文本、Base64 和 Unicode 转义双向转换。</p></div>
        <span class="tool-local-badge tool-warning-badge">编码不是加密</span>
      </header>
      <div class="tool-grid tool-grid-editor">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="codec-input">输入内容</label><span>UTF-8</span></div>
          <textarea id="codec-input" class="tool-textarea-compact" spellcheck="false" placeholder="输入中文、Emoji、Base64 或 Unicode 转义"></textarea>
        </div>
        <div class="tool-field">
          <div class="tool-field-heading"><label for="codec-output">转换结果</label><span>纯文本</span></div>
          <textarea id="codec-output" class="tool-textarea-compact" spellcheck="false" placeholder="结果会显示在这里"></textarea>
        </div>
      </div>
      <div class="tool-actions">
        <button id="base64-encode" class="tool-button primary" type="button">Base64 编码</button>
        <button id="base64-decode" class="tool-button" type="button">Base64 解码</button>
        <button id="unicode-encode" class="tool-button" type="button">Unicode 转义</button>
        <button id="unicode-decode" class="tool-button" type="button">Unicode 还原</button>
        <button id="codec-copy" class="tool-button" type="button">复制结果</button>
        <button id="codec-clear" class="tool-button subtle" type="button">清空</button>
      </div>
      <div class="tool-help">内容仅在浏览器中处理。Base64 可以被任何人还原，请勿当作加密方式。</div>
      <div id="codec-status" class="tool-status" role="status" aria-live="polite"></div>
    </section>
    <section id="utf8-codec" class="tool-panel tool-panel-compact" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-utf8" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">UTF-8 CODEC</span><h2>UTF-8 编码转换</h2><p>将中文、英文、Emoji 等文本转换为 UTF-8 字节表示，也可反向还原。</p></div>
        <span class="tool-local-badge tool-warning-badge">编码不是加密</span>
      </header>
      <div class="utf8-toolbar">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="utf8-format">编码格式</label><span>选择输出或输入格式</span></div>
          <select id="utf8-format">
            <option value="bytes">字节流</option>
            <option value="sequence">序列</option>
            <option value="mapping">对照</option>
            <option value="percent">%XX</option>
            <option value="slash-x">\xXX</option>
            <option value="url">URL</option>
          </select>
        </div>
        <div class="utf8-format-example"><span>格式示例</span><code id="utf8-format-example">E4 B8 AD</code></div>
      </div>
      <div class="tool-grid tool-grid-editor">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="utf8-input">转换前</label><span id="utf8-input-hint">UTF-8 文本</span></div>
          <textarea id="utf8-input" class="tool-textarea-compact" spellcheck="false" placeholder="输入需要编码的文本，例如：中文 UTF-8 😀"></textarea>
        </div>
        <div class="tool-field">
          <div class="tool-field-heading"><label for="utf8-output">转换后</label><button id="utf8-copy" class="tool-text-button" type="button">复制结果</button></div>
          <textarea id="utf8-output" class="tool-textarea-compact" readonly spellcheck="false" placeholder="转换结果会显示在这里"></textarea>
        </div>
      </div>
      <div class="tool-actions">
        <button id="utf8-encode" class="tool-button primary" type="button">UTF-8 编码</button>
        <button id="utf8-decode" class="tool-button" type="button">UTF-8 解码</button>
        <button id="utf8-swap" class="tool-button" type="button">结果移到输入</button>
        <button id="utf8-clear" class="tool-button subtle" type="button">清空</button>
      </div>
      <div class="tool-help">字节流：<code>E4 B8 AD</code>；序列：<code>228, 184, 173</code>；对照：逐字符显示 Unicode 码点和 UTF-8 字节。解码时也兼容连续十六进制、<code>0xXX</code>、空格、逗号和换行。</div>
      <div class="tool-help">UTF-8 使用 1～4 个字节表示一个 Unicode 码点。所有转换仅在当前浏览器完成；编码结果可以被还原，请勿用它保护敏感信息。</div>
      <div id="utf8-status" class="tool-status" role="status" aria-live="polite"></div>
    </section>
    <section id="sql-formatter" class="tool-panel tool-panel-compact" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-sql" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">SQL FORMATTER</span><h2>SQL 格式化</h2><p>为常用 SQL 语句添加换行与缩进，也可快速压缩空白。</p></div>
        <span class="tool-local-badge">零依赖</span>
      </header>
      <div class="tool-grid tool-grid-editor">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="sql-input">原始 SQL</label><span>常用 SQL 方言</span></div>
          <textarea id="sql-input" class="tool-textarea-compact" spellcheck="false" placeholder="SELECT u.id, u.name FROM users u WHERE u.status = 1 ORDER BY u.id DESC;"></textarea>
        </div>
        <div class="tool-field">
          <div class="tool-field-heading"><label for="sql-output">格式化结果</label><span>2 空格缩进</span></div>
          <textarea id="sql-output" class="tool-textarea-compact" spellcheck="false" placeholder="结果会显示在这里"></textarea>
        </div>
      </div>
      <div class="tool-actions">
        <button id="sql-format" class="tool-button primary" type="button">格式化</button>
        <button id="sql-compact" class="tool-button" type="button">压缩</button>
        <button id="sql-copy" class="tool-button" type="button">复制结果</button>
        <button id="sql-clear" class="tool-button subtle" type="button">清空</button>
      </div>
      <div class="tool-help">轻量格式化不会执行或验证 SQL；字符串、标识符和注释内容会原样保留。</div>
      <div id="sql-status" class="tool-status" role="status" aria-live="polite"></div>
    </section>
    <section id="rsa-key-generator" class="tool-panel tool-panel-compact tool-panel-rsa" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-rsa" hidden>
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">RSA KEY GENERATOR</span><h2>RSA 公私钥生成</h2><p>生成 PEM 格式的 RSA 公私钥对，支持 PKCS#8 与 PKCS#1。</p></div>
        <span class="tool-local-badge">本地生成</span>
      </header>
      <div class="rsa-options">
        <fieldset>
          <legend>密钥长度</legend>
          <div class="tool-choice-group">
            <label><input type="radio" name="rsa-bits" value="512">512 bit</label>
            <label><input type="radio" name="rsa-bits" value="1024">1024 bit</label>
            <label><input type="radio" name="rsa-bits" value="2048" checked>2048 bit</label>
            <label><input type="radio" name="rsa-bits" value="4096">4096 bit</label>
          </div>
        </fieldset>
        <fieldset>
          <legend>密钥格式</legend>
          <div class="tool-choice-group">
            <label><input type="radio" name="rsa-format" value="pkcs8" checked>PKCS#8</label>
            <label><input type="radio" name="rsa-format" value="pkcs1">PKCS#1</label>
          </div>
        </fieldset>
        <div class="tool-field rsa-password-field">
          <div class="tool-field-heading"><label for="rsa-password">私钥密码</label><span>可选，仅 PKCS#8</span></div>
          <input id="rsa-password" type="password" autocomplete="new-password" placeholder="留空则不加密私钥">
        </div>
      </div>
      <div class="tool-actions rsa-generate-actions">
        <button id="rsa-generate" class="tool-button primary" type="button">生成密钥对</button>
        <button id="rsa-clear" class="tool-button subtle" type="button">清空</button>
      </div>
      <div class="tool-grid tool-grid-editor rsa-output-grid">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="rsa-public-key">RSA 公钥</label><button id="rsa-copy-public" class="tool-text-button" type="button">复制公钥</button></div>
          <textarea id="rsa-public-key" class="tool-textarea-compact rsa-key-output" readonly spellcheck="false" placeholder="生成的 PEM 公钥会显示在这里"></textarea>
        </div>
        <div class="tool-field">
          <div class="tool-field-heading"><label for="rsa-private-key">RSA 私钥</label><button id="rsa-copy-private" class="tool-text-button" type="button">复制私钥</button></div>
          <textarea id="rsa-private-key" class="tool-textarea-compact rsa-key-output" readonly spellcheck="false" placeholder="生成的 PEM 私钥会显示在这里"></textarea>
        </div>
      </div>
      <div class="tool-help rsa-security-note"><strong>安全提示：</strong>密钥仅在当前浏览器生成，不会上传服务器。2048 bit 是通用默认值；512/1024 bit 已不安全，仅用于旧系统兼容测试。请妥善保管私钥，不要在公共设备生成生产密钥。</div>
      <div class="tool-help">PKCS#8 常用于 Java、PHP 等程序；PKCS#1 是较早的 RSA 专用格式。密码保护使用 PBES2、PBKDF2-SHA256 与 AES-256-CBC，输出 <code>ENCRYPTED PRIVATE KEY</code>。</div>
      <div id="rsa-status" class="tool-status" role="status" aria-live="polite"></div>
    </section>
  </main>
</div>
