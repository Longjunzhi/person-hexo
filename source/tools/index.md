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
    </div>
    <div class="tools-nav-note">所有数据仅在本机浏览器处理，不会上传服务器。</div>
  </aside>

  <main class="tools-workspace">
    <section id="data-formatter" class="tool-panel is-active" role="tabpanel" data-tool-panel aria-labelledby="tool-tab-data">
      <header class="tool-panel-header">
        <div><span class="tool-eyebrow">FORMATTER</span><h2>JSON / Python 字典格式化</h2><p>自动识别两种数据格式，并实时生成规范 JSON。</p></div>
        <span class="tool-local-badge">本地处理</span>
      </header>
      <div class="tool-grid tool-grid-editor">
        <div class="tool-field">
          <div class="tool-field-heading"><label for="data-input">输入内容</label><span>JSON / Python</span></div>
          <textarea id="data-input" spellcheck="false" placeholder='粘贴 JSON，或 Python 字典：{"name": "军的小屋", "enabled": True, "value": None}'></textarea>
        </div>
        <div class="tool-field tool-output-field">
          <div class="tool-field-heading"><span class="tool-field-label">格式化结果</span><span>标准 JSON · 语法高亮</span></div>
          <pre id="data-highlight-output" class="json-highlight-output" tabindex="0" aria-label="格式化结果"><span class="json-placeholder">解析结果会自动显示在这里</span></pre>
          <textarea id="data-output" hidden readonly aria-hidden="true"></textarea>
        </div>
      </div>
      <div class="tool-panel-footer">
        <div class="tool-actions">
          <button id="format-data" class="tool-button primary" type="button">格式化</button>
          <button id="compact-data" class="tool-button" type="button">压缩</button>
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
  </main>
</div>
