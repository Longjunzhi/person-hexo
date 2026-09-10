---
title: 在线工具
date: 2026-09-10 12:00:00
comments: false
---

<div class="tools-page">
  <section class="tool-card" aria-labelledby="data-format-title">
    <h2 id="data-format-title">JSON / Python 字典格式化</h2>
    <p>自动识别 JSON 与 Python 字典，仅在当前浏览器中解析，不会上传数据。</p>
    <div class="tool-grid">
      <div class="tool-field">
        <label for="data-input">输入</label>
        <textarea id="data-input" spellcheck="false" placeholder='粘贴 JSON，或 Python 字典：{"name": "军的小屋", "enabled": True, "value": None}'></textarea>
      </div>
      <div class="tool-field">
        <label for="data-output">格式化结果</label>
        <textarea id="data-output" spellcheck="false" readonly placeholder="解析结果会自动显示在这里"></textarea>
      </div>
    </div>
    <div class="tool-actions">
      <button id="format-data" class="tool-button primary" type="button">格式化</button>
      <button id="compact-data" class="tool-button" type="button">压缩</button>
      <button id="copy-data" class="tool-button" type="button">复制结果</button>
      <button id="clear-data" class="tool-button" type="button">清空</button>
    </div>
    <div id="data-status" class="tool-status" role="status" aria-live="polite"></div>
  </section>

  <section class="tool-card" aria-labelledby="timestamp-title">
    <h2 id="timestamp-title">时间戳转换</h2>
    <p>支持秒和毫秒时间戳自动识别，也可以把本地日期时间转换为时间戳。</p>
    <div class="tool-grid">
      <div class="tool-field">
        <label for="timestamp-input">时间戳</label>
        <input id="timestamp-input" type="text" inputmode="numeric" placeholder="例如：1757476800 或 1757476800000">
      </div>
      <div class="tool-field">
        <label for="datetime-input">本地日期时间</label>
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
</div>
