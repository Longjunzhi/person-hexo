(function() {
  'use strict';

  var dataInput = document.getElementById('data-input');
  if (!dataInput) return;

  var dataOutput = document.getElementById('data-output');
  var dataHighlightOutput = document.getElementById('data-highlight-output');
  var dataOutputFormat = document.getElementById('data-output-format');
  var dataStatus = document.getElementById('data-status');
  var timestampInput = document.getElementById('timestamp-input');
  var datetimeInput = document.getElementById('datetime-input');
  var timeStatus = document.getElementById('time-status');
  var colorPicker = document.getElementById('color-picker');
  var colorHexInput = document.getElementById('color-hex');
  var colorPalette = document.getElementById('color-palette');
  var colorStatus = document.getElementById('color-status');
  var urlInput = document.getElementById('url-input');
  var urlOutput = document.getElementById('url-output');
  var urlStatus = document.getElementById('url-status');
  var codecInput = document.getElementById('codec-input');
  var codecOutput = document.getElementById('codec-output');
  var codecStatus = document.getElementById('codec-status');
  var utf8Input = document.getElementById('utf8-input');
  var utf8Output = document.getElementById('utf8-output');
  var utf8Format = document.getElementById('utf8-format');
  var utf8Status = document.getElementById('utf8-status');
  var sqlInput = document.getElementById('sql-input');
  var sqlOutput = document.getElementById('sql-output');
  var sqlStatus = document.getElementById('sql-status');
  var rsaPublicKey = document.getElementById('rsa-public-key');
  var rsaPrivateKey = document.getElementById('rsa-private-key');
  var rsaPassword = document.getElementById('rsa-password');
  var rsaStatus = document.getElementById('rsa-status');
  var qrTextInput = document.getElementById('qr-text-input');
  var qrOutputCanvas = document.getElementById('qr-output-canvas');
  var qrGenerateStatus = document.getElementById('qr-generate-status');
  var qrImageInput = document.getElementById('qr-image-input');
  var qrCameraInput = document.getElementById('qr-camera-input');
  var qrDropZone = document.getElementById('qr-drop-zone');
  var qrScanCanvas = document.getElementById('qr-scan-canvas');
  var qrResult = document.getElementById('qr-result');
  var qrScanStatus = document.getElementById('qr-scan-status');
  var toolNavItems = document.querySelectorAll('[data-tool-target]');
  var toolPanels = document.querySelectorAll('[data-tool-panel]');
  var parseTimer;

  function activateTool(toolId, updateHash) {
    var matched = false;

    Array.prototype.forEach.call(toolPanels, function(panel) {
      var isActive = panel.id === toolId;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
      if (isActive) matched = true;
    });

    if (!matched) return false;

    Array.prototype.forEach.call(toolNavItems, function(item) {
      var isActive = item.getAttribute('data-tool-target') === toolId;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      item.tabIndex = isActive ? 0 : -1;
    });

    if (updateHash && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + toolId);
    }
    return true;
  }

  Array.prototype.forEach.call(toolNavItems, function(item) {
    item.addEventListener('click', function() {
      activateTool(item.getAttribute('data-tool-target'), true);
    });
  });

  var initialTool = window.location.hash.slice(1);
  if (!activateTool(initialTool, false)) activateTool('data-formatter', false);

  window.addEventListener('hashchange', function() {
    activateTool(window.location.hash.slice(1), false);
  });

  function setStatus(element, message, type) {
    element.textContent = message;
    element.className = 'tool-status' + (type ? ' ' + type : '');
  }

  function PythonLiteralParser(source) {
    this.source = source;
    this.position = 0;
  }

  PythonLiteralParser.prototype.peek = function() {
    return this.source[this.position];
  };

  PythonLiteralParser.prototype.skipWhitespace = function() {
    while (/\s/.test(this.peek() || '')) this.position += 1;
  };

  PythonLiteralParser.prototype.error = function(message) {
    throw new Error(message + '（位置 ' + (this.position + 1) + '）');
  };

  PythonLiteralParser.prototype.parse = function() {
    this.skipWhitespace();
    var value = this.parseValue();
    this.skipWhitespace();
    if (this.position !== this.source.length) this.error('存在多余内容');
    return value;
  };

  PythonLiteralParser.prototype.parseValue = function() {
    this.skipWhitespace();
    var character = this.peek();
    if (character === '{') return this.parseObject();
    if (character === '[') return this.parseSequence('[', ']');
    if (character === '(') return this.parseSequence('(', ')');
    if (character === '"' || character === "'") return this.parseString();
    if (character === '-' || character === '+' || /[0-9]/.test(character || '')) return this.parseNumber();
    return this.parseKeyword();
  };

  PythonLiteralParser.prototype.parseObject = function() {
    var result = Object.create(null);
    this.position += 1;
    this.skipWhitespace();
    if (this.peek() === '}') {
      this.position += 1;
      return result;
    }

    while (this.position < this.source.length) {
      var key = this.parseValue();
      if (typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'boolean') {
        this.error('字典键必须是字符串、数字或布尔值');
      }
      this.skipWhitespace();
      if (this.peek() !== ':') this.error('字典键后缺少冒号');
      this.position += 1;
      result[String(key)] = this.parseValue();
      this.skipWhitespace();
      if (this.peek() === '}') {
        this.position += 1;
        return result;
      }
      if (this.peek() !== ',') this.error('字典项之间缺少逗号');
      this.position += 1;
      this.skipWhitespace();
      if (this.peek() === '}') {
        this.position += 1;
        return result;
      }
    }
    this.error('字典缺少右花括号');
  };

  PythonLiteralParser.prototype.parseSequence = function(opening, closing) {
    var result = [];
    if (this.peek() !== opening) this.error('序列格式错误');
    this.position += 1;
    this.skipWhitespace();
    if (this.peek() === closing) {
      this.position += 1;
      return result;
    }

    while (this.position < this.source.length) {
      result.push(this.parseValue());
      this.skipWhitespace();
      if (this.peek() === closing) {
        this.position += 1;
        return result;
      }
      if (this.peek() !== ',') this.error('序列项之间缺少逗号');
      this.position += 1;
      this.skipWhitespace();
      if (this.peek() === closing) {
        this.position += 1;
        return result;
      }
    }
    this.error('序列缺少结束符号');
  };

  PythonLiteralParser.prototype.parseString = function() {
    var quote = this.peek();
    var result = '';
    this.position += 1;

    while (this.position < this.source.length) {
      var character = this.source[this.position++];
      if (character === quote) return result;
      if (character !== '\\') {
        result += character;
        continue;
      }
      if (this.position >= this.source.length) this.error('字符串转义不完整');
      var escaped = this.source[this.position++];
      var escapes = {n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '\\': '\\', "'": "'", '"': '"'};
      if (escaped === 'u') {
        var hex = this.source.slice(this.position, this.position + 4);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) this.error('Unicode 转义无效');
        result += String.fromCharCode(parseInt(hex, 16));
        this.position += 4;
      } else {
        result += Object.prototype.hasOwnProperty.call(escapes, escaped) ? escapes[escaped] : escaped;
      }
    }
    this.error('字符串缺少结束引号');
  };

  PythonLiteralParser.prototype.parseNumber = function() {
    var remaining = this.source.slice(this.position);
    var match = remaining.match(/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/);
    if (!match) this.error('数字格式无效');
    this.position += match[0].length;
    var value = Number(match[0]);
    if (!Number.isFinite(value)) this.error('数字超出有效范围');
    return value;
  };

  PythonLiteralParser.prototype.parseKeyword = function() {
    var remaining = this.source.slice(this.position);
    var keywords = {True: true, False: false, None: null, true: true, false: false, null: null};
    var match = remaining.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (!match || !Object.prototype.hasOwnProperty.call(keywords, match[0])) {
      this.error('只支持安全的 Python 字面量');
    }
    this.position += match[0].length;
    return keywords[match[0]];
  };

  function parseData(source) {
    var text = source.trim();
    if (!text) throw new Error('请输入 JSON 或 Python 字典');
    try {
      return {value: JSON.parse(text), type: 'JSON'};
    } catch (jsonError) {
      return {value: new PythonLiteralParser(text).parse(), type: 'Python 字典'};
    }
  }

  function resetHighlightedOutput() {
    dataHighlightOutput.textContent = '';
    var placeholder = document.createElement('span');
    placeholder.className = 'json-placeholder';
    placeholder.textContent = '解析结果会自动显示在这里';
    dataHighlightOutput.appendChild(placeholder);
  }

  function renderHighlightedJson(jsonText) {
    dataHighlightOutput.textContent = '';

    // Keep large payloads responsive by avoiding thousands of highlight nodes.
    if (jsonText.length > 300000) {
      dataHighlightOutput.textContent = jsonText;
      return false;
    }

    var fragment = document.createDocumentFragment();
    var tokenPattern = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:|"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
    var cursor = 0;
    var match;

    while ((match = tokenPattern.exec(jsonText)) !== null) {
      if (match.index > cursor) {
        fragment.appendChild(document.createTextNode(jsonText.slice(cursor, match.index)));
      }

      var token = match[0];
      var span = document.createElement('span');
      if (/^".*"\s*:$/.test(token)) span.className = 'json-key';
      else if (token.charAt(0) === '"') span.className = 'json-string';
      else if (token === 'true' || token === 'false') span.className = 'json-boolean';
      else if (token === 'null') span.className = 'json-null';
      else span.className = 'json-number';
      span.textContent = token;
      fragment.appendChild(span);
      cursor = tokenPattern.lastIndex;
    }

    if (cursor < jsonText.length) {
      fragment.appendChild(document.createTextNode(jsonText.slice(cursor)));
    }
    dataHighlightOutput.appendChild(fragment);
    return true;
  }

  function stringifyPython(value, compact, depth) {
    depth = depth || 0;
    if (value === null) return 'None';
    if (value === true) return 'True';
    if (value === false) return 'False';
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value === 'number') return String(value);

    var indent = compact ? '' : new Array(depth + 1).join('  ');
    var childIndent = compact ? '' : new Array(depth + 2).join('  ');
    var separator = compact ? ', ' : ',\n';
    if (Array.isArray(value)) {
      if (!value.length) return '[]';
      var items = value.map(function(item) {
        return childIndent + stringifyPython(item, compact, depth + 1);
      });
      return compact ? '[' + items.join(separator) + ']' : '[\n' + items.join(separator) + '\n' + indent + ']';
    }

    var keys = Object.keys(value);
    if (!keys.length) return '{}';
    var entries = keys.map(function(key) {
      return childIndent + JSON.stringify(key) + ': ' + stringifyPython(value[key], compact, depth + 1);
    });
    return compact ? '{' + entries.join(separator) + '}' : '{\n' + entries.join(separator) + '\n' + indent + '}';
  }

  function showDataResult(value, type, compact, sourceType) {
    var formatted = type === 'Python 字典'
      ? stringifyPython(value, compact, 0)
      : JSON.stringify(value, null, compact ? 0 : 2);
    dataOutput.value = formatted;
    dataHighlightOutput.textContent = formatted;
    var highlighted = true;
    if (type === 'JSON') highlighted = renderHighlightedJson(formatted);
    dataOutputFormat.textContent = type + (type === 'JSON' ? ' · 语法高亮' : ' · Python 字面量');
    var message = sourceType ? sourceType + ' → ' + type + ' 转换成功。' : '已识别为' + type + '，格式化成功。';
    if (!highlighted) message += ' 内容较大，已关闭高亮以保持流畅。';
    setStatus(dataStatus, message, 'success');
  }

  function renderData(compact) {
    try {
      var parsed = parseData(dataInput.value);
      showDataResult(parsed.value, 'JSON', compact, parsed.type === 'JSON' ? '' : parsed.type);
    } catch (error) {
      dataOutput.value = '';
      resetHighlightedOutput();
      setStatus(dataStatus, error.message, 'error');
    }
  }

  function convertJsonToPython() {
    try {
      var value = JSON.parse(dataInput.value.trim());
      showDataResult(value, 'Python 字典', false, 'JSON');
    } catch (error) {
      dataOutput.value = '';
      resetHighlightedOutput();
      setStatus(dataStatus, '请输入有效的 JSON：' + error.message, 'error');
    }
  }

  function convertPythonToJson() {
    try {
      var value = new PythonLiteralParser(dataInput.value.trim()).parse();
      showDataResult(value, 'JSON', false, 'Python 字典');
    } catch (error) {
      dataOutput.value = '';
      resetHighlightedOutput();
      setStatus(dataStatus, '请输入有效的 Python 字典：' + error.message, 'error');
    }
  }

  function copyText(text, statusElement, successMessage) {
    if (!text) {
      setStatus(statusElement, '没有可复制的内容。', 'error');
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      setStatus(statusElement, successMessage, 'success');
    }).catch(function() {
      setStatus(statusElement, '复制失败，请手动选择复制。', 'error');
    });
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function normalizeHex(value) {
    var hex = value.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }
    return /^[0-9a-fA-F]{6}$/.test(hex) ? '#' + hex.toUpperCase() : null;
  }

  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
  }

  function rgbToHex(rgb) {
    return '#' + [rgb.r, rgb.g, rgb.b].map(function(value) {
      return Math.round(value).toString(16).padStart(2, '0');
    }).join('').toUpperCase();
  }

  function mixColors(base, target, amount) {
    return rgbToHex({
      r: base.r + (target.r - base.r) * amount,
      g: base.g + (target.g - base.g) * amount,
      b: base.b + (target.b - base.b) * amount
    });
  }

  function rgbToHsl(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
    var hue = 0;
    var lightness = (max + min) / 2;
    var saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    if (delta !== 0) {
      if (max === r) hue = 60 * (((g - b) / delta) % 6);
      else if (max === g) hue = 60 * ((b - r) / delta + 2);
      else hue = 60 * ((r - g) / delta + 4);
    }
    if (hue < 0) hue += 360;
    return {h: Math.round(hue), s: Math.round(saturation * 100), l: Math.round(lightness * 100)};
  }

  function readableTextColor(rgb) {
    var luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return luminance > 150 ? '#0F172A' : '#FFFFFF';
  }

  function buildPalette(hex) {
    var base = hexToRgb(hex);
    var white = {r: 255, g: 255, b: 255};
    var black = {r: 0, g: 0, b: 0};
    var stops = [
      {name: '50', color: mixColors(base, white, 0.92)},
      {name: '100', color: mixColors(base, white, 0.82)},
      {name: '200', color: mixColors(base, white, 0.66)},
      {name: '300', color: mixColors(base, white, 0.48)},
      {name: '400', color: mixColors(base, white, 0.25)},
      {name: '500', color: hex},
      {name: '600', color: mixColors(base, black, 0.14)},
      {name: '700', color: mixColors(base, black, 0.28)},
      {name: '800', color: mixColors(base, black, 0.4)},
      {name: '900', color: mixColors(base, black, 0.52)}
    ];
    return stops;
  }

  function renderColorPalette(hex) {
    var rgb = hexToRgb(hex);
    var hsl = rgbToHsl(rgb);
    var stops = buildPalette(hex);
    colorPalette.textContent = '';
    stops.forEach(function(stop) {
      var button = document.createElement('button');
      var stopRgb = hexToRgb(stop.color);
      button.type = 'button';
      button.className = 'color-swatch';
      button.style.backgroundColor = stop.color;
      button.style.color = readableTextColor(stopRgb);
      button.setAttribute('data-color', stop.color);
      button.setAttribute('aria-label', '复制色阶 ' + stop.name + '：' + stop.color);
      var name = document.createElement('strong');
      name.textContent = stop.name;
      var value = document.createElement('span');
      value.textContent = stop.color;
      button.appendChild(name);
      button.appendChild(value);
      colorPalette.appendChild(button);
    });
    document.getElementById('color-base-value').textContent = hex;
    document.getElementById('color-rgb-value').textContent = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    document.getElementById('color-hsl-value').textContent = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
    colorPicker.value = hex.toLowerCase();
    colorHexInput.value = hex;
    return stops;
  }

  function updateColor(value) {
    var hex = normalizeHex(value);
    if (!hex) {
      setStatus(colorStatus, '请输入有效的 HEX 颜色，例如 #0284C7。', 'error');
      return;
    }
    renderColorPalette(hex);
    setStatus(colorStatus, '色阶已更新，点击任意色块即可复制。', 'success');
  }

  function toDatetimeLocal(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function renderTime(milliseconds) {
    var date = new Date(milliseconds);
    if (!Number.isFinite(milliseconds) || Number.isNaN(date.getTime())) {
      setStatus(timeStatus, '请输入有效时间戳或日期。', 'error');
      return;
    }
    document.getElementById('time-local').textContent = date.toLocaleString(undefined, {hour12: false});
    document.getElementById('time-utc').textContent = date.toISOString();
    document.getElementById('time-seconds').textContent = String(Math.floor(milliseconds / 1000));
    document.getElementById('time-milliseconds').textContent = String(Math.trunc(milliseconds));
    timestampInput.value = String(Math.trunc(milliseconds));
    datetimeInput.value = toDatetimeLocal(date);
    setStatus(timeStatus, '转换成功，时间按当前浏览器时区显示。', 'success');
  }

  function timestampToDate() {
    var text = timestampInput.value.trim();
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) {
      setStatus(timeStatus, '时间戳只能包含数字。', 'error');
      return;
    }
    var value = Number(text);
    renderTime(Math.abs(value) < 100000000000 ? value * 1000 : value);
  }

  function requireInput(element, message) {
    var value = element.value;
    if (!value.trim()) throw new Error(message);
    return value;
  }

  function runTextTransform(input, output, status, transform, successMessage) {
    try {
      output.value = transform(requireInput(input, '请输入需要转换的内容。'));
      setStatus(status, successMessage, 'success');
    } catch (error) {
      output.value = '';
      setStatus(status, error.message || '转换失败，请检查输入内容。', 'error');
    }
  }

  function getQueryText(value) {
    var text = value.trim();
    var questionMark = text.indexOf('?');
    if (questionMark !== -1) text = text.slice(questionMark + 1);
    var hash = text.indexOf('#');
    if (hash !== -1) text = text.slice(0, hash);
    return text.replace(/^\?/, '');
  }

  function parseQuery(value) {
    var query = getQueryText(value);
    if (!query) throw new Error('未找到 Query 参数。');
    var result = Object.create(null);
    new URLSearchParams(query).forEach(function(itemValue, key) {
      if (!Object.prototype.hasOwnProperty.call(result, key)) result[key] = itemValue;
      else if (Array.isArray(result[key])) result[key].push(itemValue);
      else result[key] = [result[key], itemValue];
    });
    return JSON.stringify(result, null, 2);
  }

  function buildQuery(value) {
    var parsed;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      throw new Error('请输入有效的 JSON 对象。');
    }
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      throw new Error('Query 数据必须是 JSON 对象。');
    }
    var params = new URLSearchParams();
    Object.keys(parsed).forEach(function(key) {
      var values = Array.isArray(parsed[key]) ? parsed[key] : [parsed[key]];
      values.forEach(function(item) {
        params.append(key, item === null ? '' : String(item));
      });
    });
    return params.toString();
  }

  function textToBase64(value) {
    var bytes = new TextEncoder().encode(value);
    var binary = '';
    var chunkSize = 32768;
    for (var offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  }

  function base64ToText(value) {
    var normalized = value.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    if (!normalized || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
      throw new Error('请输入有效的 Base64 内容。');
    }
    while (normalized.length % 4) normalized += '=';
    var binary;
    try {
      binary = atob(normalized);
    } catch (error) {
      throw new Error('请输入有效的 Base64 内容。');
    }
    var bytes = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    try {
      return new TextDecoder('utf-8', {fatal: true}).decode(bytes);
    } catch (error) {
      throw new Error('Base64 解码结果不是有效的 UTF-8 文本。');
    }
  }

  function textToUnicode(value) {
    var result = '';
    for (var index = 0; index < value.length; index += 1) {
      var code = value.charCodeAt(index);
      if (code >= 32 && code <= 126 && code !== 92) result += value.charAt(index);
      else result += '\\u' + code.toString(16).toUpperCase().padStart(4, '0');
    }
    return result;
  }

  function unicodeToText(value) {
    return value
      .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, function(match, hex) {
        var codePoint = parseInt(hex, 16);
        if (codePoint > 0x10FFFF) throw new Error('Unicode 码点超出有效范围。');
        return String.fromCodePoint(codePoint);
      })
      .replace(/\\u([0-9a-fA-F]{4})/g, function(match, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      });
  }

  var utf8FormatDetails = {
    bytes: {example: 'E4 B8 AD', hint: '十六进制字节流'},
    sequence: {example: '228, 184, 173', hint: '十进制字节序列'},
    mapping: {example: '中 U+4E2D → E4 B8 AD', hint: '逐字符编码对照'},
    percent: {example: '%E4%B8%AD', hint: '%XX 百分号字节'},
    'slash-x': {example: '\\xE4\\xB8\\xAD', hint: '\\xXX 字节转义'},
    url: {example: '%E4%B8%AD', hint: 'URL 编码文本'}
  };

  function byteToHex(byte) {
    return byte.toString(16).toUpperCase().padStart(2, '0');
  }

  function encodeUtf8Mapping(value) {
    var encoder = new TextEncoder();
    return Array.from(value).map(function(character) {
      var bytes = Array.from(encoder.encode(character)).map(byteToHex).join(' ');
      var labels = {' ': '␠', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
      var label = Object.prototype.hasOwnProperty.call(labels, character) ? labels[character] : character;
      return label + ' U+' + character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0') + ' → ' + bytes;
    }).join('\n');
  }

  function encodeUtf8(value, format) {
    if (!value) throw new Error('请输入需要编码的文本。');
    if (format === 'url') return encodeURIComponent(value);
    if (format === 'mapping') return encodeUtf8Mapping(value);
    var bytes = Array.from(new TextEncoder().encode(value));
    if (format === 'sequence') return bytes.join(', ');
    if (format === 'percent') return bytes.map(function(byte) { return '%' + byteToHex(byte); }).join('');
    if (format === 'slash-x') return bytes.map(function(byte) { return '\\x' + byteToHex(byte); }).join('');
    return bytes.map(byteToHex).join(' ');
  }

  function parseDecimalBytes(value) {
    var tokens = value.trim().split(/[\s,;]+/).filter(Boolean);
    if (!tokens.length || tokens.some(function(token) { return !/^\d{1,3}$/.test(token) || Number(token) > 255; })) {
      throw new Error('序列必须由 0～255 的十进制字节组成。');
    }
    return new Uint8Array(tokens.map(Number));
  }

  function parseHexBytes(value, mapping) {
    var text = value.trim();
    if (mapping) {
      var lines = text.split(/\r?\n/).filter(function(line) { return line.trim(); });
      if (!lines.length || lines.some(function(line) { return line.indexOf('→') === -1 && line.indexOf('->') === -1; })) {
        throw new Error('对照格式应为“字符 U+码点 → UTF-8 字节”。');
      }
      text = lines.map(function(line) { return line.split(/→|->/).pop(); }).join(' ');
    }
    text = text.replace(/%|\\x|0x/gi, '').replace(/[\s,:;_-]+/g, '');
    if (!text || !/^[0-9a-fA-F]+$/.test(text) || text.length % 2 !== 0) {
      throw new Error('请输入有效的 UTF-8 十六进制字节，每个字节需要两位。');
    }
    var bytes = [];
    for (var index = 0; index < text.length; index += 2) bytes.push(parseInt(text.slice(index, index + 2), 16));
    return new Uint8Array(bytes);
  }

  function decodeUtf8(value, format) {
    if (!value.trim()) throw new Error('请输入需要解码的 UTF-8 内容。');
    if (format === 'url') {
      try {
        return decodeURIComponent(value);
      } catch (error) {
        throw new Error('请输入有效的 URL 编码内容。');
      }
    }
    var bytes = format === 'sequence' ? parseDecimalBytes(value) : parseHexBytes(value, format === 'mapping');
    try {
      return new TextDecoder('utf-8', {fatal: true}).decode(bytes);
    } catch (error) {
      throw new Error('字节序列不是有效的 UTF-8 编码。');
    }
  }

  function updateUtf8FormatHelp() {
    var detail = utf8FormatDetails[utf8Format.value];
    document.getElementById('utf8-format-example').textContent = detail.example;
    document.getElementById('utf8-input-hint').textContent = detail.hint;
  }

  function protectSqlParts(value) {
    var parts = [];
    var pattern = /(?:'(?:''|\\.|[^'\\])*'|"(?:""|\\.|[^"\\])*"|`(?:``|[^`])*`|\[(?:\]\]|[^\]])*\]|--[^\r\n]*|#[^\r\n]*|\/\*[\s\S]*?\*\/)/g;
    return {
      text: value.replace(pattern, function(match) {
        var token = '\uE000' + parts.length + '\uE001';
        parts.push(match);
        return token;
      }),
      parts: parts
    };
  }

  function restoreSqlParts(value, parts) {
    return value.replace(/\uE000(\d+)\uE001/g, function(match, index) {
      return parts[Number(index)];
    });
  }

  function normalizeSqlKeywords(value) {
    var keywords = 'select|distinct|from|where|group by|order by|having|limit|offset|fetch|insert into|update|delete from|set|values|returning|union all|union|intersect|except|left outer join|right outer join|full outer join|left join|right join|full join|inner join|cross join|join|on|and|or|as|case|when|then|else|end|is null|is not null|in|not in|exists|between|like|asc|desc';
    var pattern = new RegExp('\\b(' + keywords.replace(/ /g, '\\s+') + ')\\b', 'gi');
    return value.replace(pattern, function(keyword) {
      return keyword.replace(/\s+/g, ' ').toUpperCase();
    });
  }

  function formatSql(value) {
    var protectedSql = protectSqlParts(value.trim());
    var sql = protectedSql.text.replace(/\s+/g, ' ').trim();
    if (!sql) throw new Error('请输入需要格式化的 SQL。');
    sql = normalizeSqlKeywords(sql);
    sql = sql
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*;\s*/g, ';\n')
      .replace(/\s+(SELECT|INSERT INTO|UPDATE|DELETE FROM|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|FETCH|RETURNING|UNION ALL|UNION|INTERSECT|EXCEPT)\b/g, '\n$1')
      .replace(/\s+(LEFT OUTER JOIN|RIGHT OUTER JOIN|FULL OUTER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|INNER JOIN|CROSS JOIN|JOIN)\b/g, '\n$1')
      .replace(/\s+(AND|OR)\s+/g, '\n  $1 ')
      .replace(/\s+(ON|SET|VALUES)\s+/g, '\n  $1 ')
      .replace(/\n{2,}/g, '\n')
      .trim();
    return restoreSqlParts(sql, protectedSql.parts);
  }

  function compactSql(value) {
    var protectedSql = protectSqlParts(value.trim());
    if (!protectedSql.text) throw new Error('请输入需要压缩的 SQL。');
    var sql = protectedSql.text.replace(/\s+/g, ' ').replace(/\s*([,;()])\s*/g, '$1').trim();
    return restoreSqlParts(sql, protectedSql.parts);
  }

  function bytesToPem(bytes, label, headers) {
    var binary = '';
    var array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    for (var offset = 0; offset < array.length; offset += 32768) {
      binary += String.fromCharCode.apply(null, array.subarray(offset, offset + 32768));
    }
    var body = btoa(binary).match(/.{1,64}/g).join('\n');
    return '-----BEGIN ' + label + '-----\n' + (headers ? headers + '\n\n' : '') + body + '\n-----END ' + label + '-----';
  }

  function readDerLength(bytes, offset) {
    var first = bytes[offset];
    if (first < 128) return {length: first, bytes: 1};
    var count = first & 127;
    if (!count || count > 4) throw new Error('无法解析生成的密钥格式。');
    var length = 0;
    for (var index = 0; index < count; index += 1) length = length * 256 + bytes[offset + 1 + index];
    return {length: length, bytes: count + 1};
  }

  function readDerElement(bytes, offset) {
    var lengthInfo = readDerLength(bytes, offset + 1);
    var contentStart = offset + 1 + lengthInfo.bytes;
    return {tag: bytes[offset], start: offset, contentStart: contentStart, end: contentStart + lengthInfo.length};
  }

  function extractPkcs1Private(pkcs8) {
    var bytes = new Uint8Array(pkcs8);
    var sequence = readDerElement(bytes, 0);
    var cursor = sequence.contentStart;
    cursor = readDerElement(bytes, cursor).end;
    cursor = readDerElement(bytes, cursor).end;
    var privateKey = readDerElement(bytes, cursor);
    if (privateKey.tag !== 4) throw new Error('无法从 PKCS#8 提取 PKCS#1 私钥。');
    return bytes.slice(privateKey.contentStart, privateKey.end);
  }

  function extractPkcs1Public(spki) {
    var bytes = new Uint8Array(spki);
    var sequence = readDerElement(bytes, 0);
    var cursor = readDerElement(bytes, sequence.contentStart).end;
    var bitString = readDerElement(bytes, cursor);
    if (bitString.tag !== 3 || bytes[bitString.contentStart] !== 0) throw new Error('无法从公钥中提取 PKCS#1 数据。');
    return bytes.slice(bitString.contentStart + 1, bitString.end);
  }

  function derLength(length) {
    if (length < 128) return new Uint8Array([length]);
    var bytes = [];
    while (length) {
      bytes.unshift(length & 255);
      length >>>= 8;
    }
    return new Uint8Array([128 | bytes.length].concat(bytes));
  }

  function concatBytes(parts) {
    var length = parts.reduce(function(total, part) { return total + part.length; }, 0);
    var result = new Uint8Array(length);
    var offset = 0;
    parts.forEach(function(part) { result.set(part, offset); offset += part.length; });
    return result;
  }

  function der(tag, content) {
    return concatBytes([new Uint8Array([tag]), derLength(content.length), content]);
  }

  function derSequence(parts) { return der(48, concatBytes(parts)); }
  function derOctet(bytes) { return der(4, bytes); }
  function derInteger(value) {
    var bytes = [];
    do { bytes.unshift(value & 255); value >>>= 8; } while (value);
    if (bytes[0] & 128) bytes.unshift(0);
    return der(2, new Uint8Array(bytes));
  }
  function derOid(bytes) { return der(6, new Uint8Array(bytes)); }

  async function encryptPkcs8(pkcs8, password) {
    var encoder = new TextEncoder();
    var salt = crypto.getRandomValues(new Uint8Array(16));
    var iv = crypto.getRandomValues(new Uint8Array(16));
    var iterations = 210000;
    var passwordKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    var aesKey = await crypto.subtle.deriveKey(
      {name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: iterations},
      passwordKey,
      {name: 'AES-CBC', length: 256},
      false,
      ['encrypt']
    );
    var encrypted = new Uint8Array(await crypto.subtle.encrypt({name: 'AES-CBC', iv: iv}, aesKey, pkcs8));
    var oidPbes2 = derOid([42, 134, 72, 134, 247, 13, 1, 5, 13]);
    var oidPbkdf2 = derOid([42, 134, 72, 134, 247, 13, 1, 5, 12]);
    var oidHmacSha256 = derOid([42, 134, 72, 134, 247, 13, 2, 9]);
    var oidAes256Cbc = derOid([96, 134, 72, 1, 101, 3, 4, 1, 42]);
    var nullValue = der(5, new Uint8Array(0));
    var prf = derSequence([oidHmacSha256, nullValue]);
    var pbkdf2Params = derSequence([derOctet(salt), derInteger(iterations), derInteger(32), prf]);
    var kdf = derSequence([oidPbkdf2, pbkdf2Params]);
    var encryptionScheme = derSequence([oidAes256Cbc, derOctet(iv)]);
    var pbes2Params = derSequence([kdf, encryptionScheme]);
    return derSequence([derSequence([oidPbes2, pbes2Params]), derOctet(encrypted)]);
  }

  async function generateRsaKeyPair() {
    if (!window.crypto || !crypto.subtle) {
      setStatus(rsaStatus, '当前浏览器不支持 Web Crypto，请升级浏览器后重试。', 'error');
      return;
    }
    var bits = Number(document.querySelector('input[name="rsa-bits"]:checked').value);
    var format = document.querySelector('input[name="rsa-format"]:checked').value;
    var password = rsaPassword.value;
    if (format === 'pkcs1' && password) {
      setStatus(rsaStatus, 'PKCS#1 不输出旧式密码加密 PEM；请清空密码或改选 PKCS#8。', 'error');
      return;
    }
    var button = document.getElementById('rsa-generate');
    button.disabled = true;
    button.textContent = '生成中…';
    setStatus(rsaStatus, bits === 4096 ? '正在生成 4096 bit 密钥，可能需要一些时间…' : '正在生成密钥…', '');
    try {
      var keyPair = await crypto.subtle.generateKey(
        {name: 'RSA-OAEP', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256'},
        true,
        ['encrypt', 'decrypt']
      );
      var spki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      var pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      if (format === 'pkcs1') {
        rsaPublicKey.value = bytesToPem(extractPkcs1Public(spki), 'RSA PUBLIC KEY');
        rsaPrivateKey.value = bytesToPem(extractPkcs1Private(pkcs8), 'RSA PRIVATE KEY');
      } else {
        rsaPublicKey.value = bytesToPem(spki, 'PUBLIC KEY');
        if (password) {
          rsaPrivateKey.value = bytesToPem(await encryptPkcs8(pkcs8, password), 'ENCRYPTED PRIVATE KEY');
        } else {
          rsaPrivateKey.value = bytesToPem(pkcs8, 'PRIVATE KEY');
        }
      }
      setStatus(rsaStatus, bits + ' bit ' + format.toUpperCase() + ' 密钥对生成成功' + (password ? '，私钥已加密。' : '。'), 'success');
    } catch (error) {
      rsaPublicKey.value = '';
      rsaPrivateKey.value = '';
      setStatus(rsaStatus, '密钥生成失败：' + (error.message || '当前浏览器可能不支持所选长度。'), 'error');
    } finally {
      button.disabled = false;
      button.textContent = '生成密钥对';
    }
  }

  function generateQrCode() {
    var text = qrTextInput.value;
    if (!text.trim()) {
      setStatus(qrGenerateStatus, '请输入需要生成二维码的文字或网址。', 'error');
      return;
    }
    if (typeof window.qrcode !== 'function') {
      setStatus(qrGenerateStatus, '二维码生成组件加载失败，请刷新页面重试。', 'error');
      return;
    }
    try {
      var level = document.getElementById('qr-level').value;
      var requestedSize = Number(document.getElementById('qr-size').value);
      window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs['UTF-8'];
      var qr = window.qrcode(0, level);
      qr.addData(text);
      qr.make();
      var moduleCount = qr.getModuleCount();
      var quietModules = 4;
      var cellSize = Math.max(1, Math.floor(requestedSize / (moduleCount + quietModules * 2)));
      var actualSize = (moduleCount + quietModules * 2) * cellSize;
      qrOutputCanvas.width = actualSize;
      qrOutputCanvas.height = actualSize;
      var context = qrOutputCanvas.getContext('2d');
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, actualSize, actualSize);
      context.fillStyle = '#000000';
      for (var row = 0; row < moduleCount; row += 1) {
        for (var column = 0; column < moduleCount; column += 1) {
          if (qr.isDark(row, column)) {
            context.fillRect((column + quietModules) * cellSize, (row + quietModules) * cellSize, cellSize, cellSize);
          }
        }
      }
      qrOutputCanvas.parentElement.classList.add('has-qr');
      document.getElementById('qr-download').disabled = false;
      setStatus(qrGenerateStatus, '二维码生成成功，实际尺寸 ' + actualSize + ' × ' + actualSize + '。', 'success');
    } catch (error) {
      setStatus(qrGenerateStatus, '生成失败：内容可能过长，请缩短文字或降低容错级别。', 'error');
    }
  }

  var qrTemplates = {
    url: {
      value: 'https://www.pangxuejun.cn/',
      help: '网址使用 https:// 开头，扫码后可在浏览器中打开。'
    },
    phone: {
      value: 'tel:13800138000',
      help: '将示例号码替换为真实号码，扫码后手机会提示拨打电话。'
    },
    sms: {
      value: 'SMSTO:13800138000:这里填写短信内容',
      help: '格式：SMSTO:手机号码:短信内容，扫码后进入短信编辑页。'
    },
    email: {
      value: 'mailto:name@example.com?subject=邮件主题&body=邮件正文',
      help: '可修改收件人、subject 邮件主题和 body 邮件正文。'
    },
    wifi: {
      value: 'WIFI:T:WPA;S:WiFi名称;P:WiFi密码;H:false;;',
      help: '修改 Wi-Fi 名称和密码；T 可使用 WPA、WEP 或 nopass。请谨慎分享包含密码的二维码。'
    },
    geo: {
      value: 'geo:31.2304,121.4737',
      help: '格式：geo:纬度,经度，扫码后可由支持的地图应用打开。'
    },
    contact: {
      value: 'BEGIN:VCARD\nVERSION:3.0\nN:张三\nFN:张三\nTEL:13800138000\nEMAIL:name@example.com\nEND:VCARD',
      help: 'vCard 联系人模板，可修改姓名、电话和邮箱后保存到通讯录。'
    }
  };

  function applyQrTemplate(templateName) {
    var template = qrTemplates[templateName];
    if (!template) return;
    qrTextInput.value = template.value;
    document.getElementById('qr-text-count').textContent = Array.from(template.value).length + ' 字符';
    document.getElementById('qr-template-help').textContent = template.help;
    qrTextInput.focus();
    qrTextInput.select();
    setStatus(qrGenerateStatus, '模板已填入，请修改示例内容后生成。', 'success');
  }

  function downloadQrCode() {
    qrOutputCanvas.toBlob(function(blob) {
      if (!blob) {
        setStatus(qrGenerateStatus, '二维码图片生成失败。', 'error');
        return;
      }
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode-' + new Date().toISOString().replace(/[:.]/g, '-') + '.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
      setStatus(qrGenerateStatus, '二维码 PNG 已下载。', 'success');
    }, 'image/png');
  }

  function drawQrLocation(context, location, scale) {
    if (!location) return;
    context.save();
    context.strokeStyle = '#0ea5e9';
    context.lineWidth = Math.max(3, 4 * scale);
    context.beginPath();
    context.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
    context.lineTo(location.topRightCorner.x, location.topRightCorner.y);
    context.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
    context.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
    context.closePath();
    context.stroke();
    context.restore();
  }

  function loadImageFile(file) {
    return new Promise(function(resolve, reject) {
      var image = new Image();
      var url = URL.createObjectURL(file);
      image.onload = function() {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = function() {
        URL.revokeObjectURL(url);
        reject(new Error('浏览器无法读取这张图片，请尝试 PNG、JPG 或 WebP 格式。'));
      };
      image.src = url;
    });
  }

  async function scanQrImage(file) {
    if (!file) return;
    if (file.type && file.type.indexOf('image/') !== 0) {
      setStatus(qrScanStatus, '请选择有效的图片文件。', 'error');
      return;
    }
    if (file.type === 'image/svg+xml') {
      setStatus(qrScanStatus, '为安全起见不读取 SVG，请使用 PNG、JPG 或 WebP 图片。', 'error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus(qrScanStatus, '图片不能超过 25 MB。', 'error');
      return;
    }
    if (typeof window.jsQR !== 'function') {
      setStatus(qrScanStatus, '二维码识别组件加载失败，请刷新页面重试。', 'error');
      return;
    }
    setStatus(qrScanStatus, '正在本地识别图片…', '');
    qrResult.value = '';
    try {
      var image = await loadImageFile(file);
      var maxSide = 2400;
      var scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      var width = Math.max(1, Math.round(image.naturalWidth * scale));
      var height = Math.max(1, Math.round(image.naturalHeight * scale));
      qrScanCanvas.width = width;
      qrScanCanvas.height = height;
      var context = qrScanCanvas.getContext('2d', {willReadFrequently: true});
      context.drawImage(image, 0, 0, width, height);
      var imageData = context.getImageData(0, 0, width, height);
      var result = window.jsQR(imageData.data, width, height, {inversionAttempts: 'attemptBoth'});
      document.getElementById('qr-scan-preview').hidden = false;
      if (!result) {
        setStatus(qrScanStatus, '未识别到二维码。请尝试更清晰、完整、正对镜头的图片。', 'error');
        return;
      }
      qrResult.value = result.data;
      drawQrLocation(context, result.location, scale);
      setStatus(qrScanStatus, '二维码识别成功，共 ' + Array.from(result.data).length + ' 个字符。', 'success');
    } catch (error) {
      document.getElementById('qr-scan-preview').hidden = true;
      setStatus(qrScanStatus, error.message || '图片读取失败，请更换图片重试。', 'error');
    }
  }

  document.getElementById('format-data').addEventListener('click', function() { renderData(false); });
  document.getElementById('compact-data').addEventListener('click', function() { renderData(true); });
  document.getElementById('json-to-python').addEventListener('click', convertJsonToPython);
  document.getElementById('python-to-json').addEventListener('click', convertPythonToJson);
  document.getElementById('copy-data').addEventListener('click', function() {
    copyText(dataOutput.value, dataStatus, '已复制格式化结果。');
  });
  document.getElementById('clear-data').addEventListener('click', function() {
    dataInput.value = '';
    dataOutput.value = '';
    dataOutputFormat.textContent = '标准 JSON · 语法高亮';
    resetHighlightedOutput();
    setStatus(dataStatus, '', '');
    dataInput.focus();
  });
  dataInput.addEventListener('input', function() {
    window.clearTimeout(parseTimer);
    parseTimer = window.setTimeout(function() {
      if (dataInput.value.trim()) renderData(false);
      else {
        dataOutput.value = '';
        resetHighlightedOutput();
        setStatus(dataStatus, '', '');
      }
    }, 350);
  });

  document.getElementById('timestamp-now').addEventListener('click', function() { renderTime(Date.now()); });
  document.getElementById('timestamp-convert').addEventListener('click', timestampToDate);
  timestampInput.addEventListener('change', timestampToDate);
  document.getElementById('datetime-convert').addEventListener('click', function() {
    var milliseconds = new Date(datetimeInput.value).getTime();
    renderTime(milliseconds);
  });
  document.getElementById('copy-timestamp').addEventListener('click', function() {
    copyText(document.getElementById('time-milliseconds').textContent, timeStatus, '已复制毫秒时间戳。');
  });

  colorPicker.addEventListener('input', function() { updateColor(colorPicker.value); });
  colorHexInput.addEventListener('input', function() {
    if (normalizeHex(colorHexInput.value)) updateColor(colorHexInput.value);
  });
  colorHexInput.addEventListener('change', function() { updateColor(colorHexInput.value); });
  document.getElementById('random-color').addEventListener('click', function() {
    var value = '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0').toUpperCase();
    updateColor(value);
  });
  colorPalette.addEventListener('click', function(event) {
    var swatch = event.target.closest('[data-color]');
    if (!swatch) return;
    copyText(swatch.getAttribute('data-color'), colorStatus, '已复制 ' + swatch.getAttribute('data-color') + '。');
  });
  document.getElementById('copy-color-css').addEventListener('click', function() {
    var hex = normalizeHex(colorHexInput.value);
    if (!hex) {
      setStatus(colorStatus, '请先输入有效的 HEX 颜色。', 'error');
      return;
    }
    var css = ':root {\n' + buildPalette(hex).map(function(stop) {
      return '  --color-' + stop.name + ': ' + stop.color + ';';
    }).join('\n') + '\n}';
    copyText(css, colorStatus, '已复制整组 CSS 变量。');
  });

  document.getElementById('url-encode').addEventListener('click', function() {
    runTextTransform(urlInput, urlOutput, urlStatus, encodeURIComponent, 'URL 组件编码完成。');
  });
  document.getElementById('url-decode').addEventListener('click', function() {
    runTextTransform(urlInput, urlOutput, urlStatus, decodeURIComponent, 'URL 组件解码完成。');
  });
  document.getElementById('url-parse-query').addEventListener('click', function() {
    runTextTransform(urlInput, urlOutput, urlStatus, parseQuery, 'Query 参数解析完成。');
  });
  document.getElementById('url-build-query').addEventListener('click', function() {
    runTextTransform(urlInput, urlOutput, urlStatus, buildQuery, 'Query 参数重组完成。');
  });
  document.getElementById('url-copy').addEventListener('click', function() {
    copyText(urlOutput.value, urlStatus, '已复制转换结果。');
  });
  document.getElementById('url-clear').addEventListener('click', function() {
    urlInput.value = '';
    urlOutput.value = '';
    setStatus(urlStatus, '', '');
    urlInput.focus();
  });

  document.getElementById('base64-encode').addEventListener('click', function() {
    runTextTransform(codecInput, codecOutput, codecStatus, textToBase64, 'Base64 编码完成。');
  });
  document.getElementById('base64-decode').addEventListener('click', function() {
    runTextTransform(codecInput, codecOutput, codecStatus, base64ToText, 'Base64 解码完成。');
  });
  document.getElementById('unicode-encode').addEventListener('click', function() {
    runTextTransform(codecInput, codecOutput, codecStatus, textToUnicode, 'Unicode 转义完成。');
  });
  document.getElementById('unicode-decode').addEventListener('click', function() {
    runTextTransform(codecInput, codecOutput, codecStatus, unicodeToText, 'Unicode 还原完成。');
  });
  document.getElementById('codec-copy').addEventListener('click', function() {
    copyText(codecOutput.value, codecStatus, '已复制转换结果。');
  });
  document.getElementById('codec-clear').addEventListener('click', function() {
    codecInput.value = '';
    codecOutput.value = '';
    setStatus(codecStatus, '', '');
    codecInput.focus();
  });

  utf8Format.addEventListener('change', updateUtf8FormatHelp);
  document.getElementById('utf8-encode').addEventListener('click', function() {
    runTextTransform(utf8Input, utf8Output, utf8Status, function(value) {
      return encodeUtf8(value, utf8Format.value);
    }, 'UTF-8 编码完成。');
  });
  document.getElementById('utf8-decode').addEventListener('click', function() {
    runTextTransform(utf8Input, utf8Output, utf8Status, function(value) {
      return decodeUtf8(value, utf8Format.value);
    }, 'UTF-8 解码完成。');
  });
  document.getElementById('utf8-copy').addEventListener('click', function() {
    copyText(utf8Output.value, utf8Status, '已复制转换结果。');
  });
  document.getElementById('utf8-swap').addEventListener('click', function() {
    if (!utf8Output.value) {
      setStatus(utf8Status, '没有可移到输入框的结果。', 'error');
      return;
    }
    utf8Input.value = utf8Output.value;
    utf8Output.value = '';
    setStatus(utf8Status, '结果已移到输入框，可继续反向转换。', 'success');
  });
  document.getElementById('utf8-clear').addEventListener('click', function() {
    utf8Input.value = '';
    utf8Output.value = '';
    setStatus(utf8Status, '', '');
    utf8Input.focus();
  });

  document.getElementById('sql-format').addEventListener('click', function() {
    runTextTransform(sqlInput, sqlOutput, sqlStatus, formatSql, 'SQL 格式化完成。');
  });
  document.getElementById('sql-compact').addEventListener('click', function() {
    runTextTransform(sqlInput, sqlOutput, sqlStatus, compactSql, 'SQL 压缩完成。');
  });
  document.getElementById('sql-copy').addEventListener('click', function() {
    copyText(sqlOutput.value, sqlStatus, '已复制 SQL 结果。');
  });
  document.getElementById('sql-clear').addEventListener('click', function() {
    sqlInput.value = '';
    sqlOutput.value = '';
    setStatus(sqlStatus, '', '');
    sqlInput.focus();
  });

  document.getElementById('rsa-generate').addEventListener('click', generateRsaKeyPair);
  document.getElementById('rsa-copy-public').addEventListener('click', function() {
    copyText(rsaPublicKey.value, rsaStatus, '已复制 RSA 公钥。');
  });
  document.getElementById('rsa-copy-private').addEventListener('click', function() {
    copyText(rsaPrivateKey.value, rsaStatus, '已复制 RSA 私钥，请注意安全保管。');
  });
  document.getElementById('rsa-clear').addEventListener('click', function() {
    rsaPublicKey.value = '';
    rsaPrivateKey.value = '';
    rsaPassword.value = '';
    setStatus(rsaStatus, '', '');
  });

  qrTextInput.addEventListener('input', function() {
    document.getElementById('qr-text-count').textContent = Array.from(qrTextInput.value).length + ' 字符';
  });
  document.querySelector('.qr-template-list').addEventListener('click', function(event) {
    var button = event.target.closest('[data-qr-template]');
    if (!button) return;
    applyQrTemplate(button.getAttribute('data-qr-template'));
  });
  document.getElementById('qr-generate').addEventListener('click', generateQrCode);
  document.getElementById('qr-download').addEventListener('click', downloadQrCode);
  document.getElementById('qr-generate-clear').addEventListener('click', function() {
    qrTextInput.value = '';
    document.getElementById('qr-text-count').textContent = '0 字符';
    qrOutputCanvas.parentElement.classList.remove('has-qr');
    document.getElementById('qr-download').disabled = true;
    setStatus(qrGenerateStatus, '', '');
    qrTextInput.focus();
  });
  [qrImageInput, qrCameraInput].forEach(function(input) {
    input.addEventListener('change', function() {
      scanQrImage(input.files && input.files[0]);
      input.value = '';
    });
  });
  qrDropZone.addEventListener('click', function(event) {
    if (event.target.closest('label')) return;
    qrImageInput.click();
  });
  qrDropZone.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      qrImageInput.click();
    }
  });
  ['dragenter', 'dragover'].forEach(function(type) {
    qrDropZone.addEventListener(type, function(event) {
      event.preventDefault();
      qrDropZone.classList.add('is-dragging');
    });
  });
  ['dragleave', 'drop'].forEach(function(type) {
    qrDropZone.addEventListener(type, function(event) {
      event.preventDefault();
      qrDropZone.classList.remove('is-dragging');
    });
  });
  qrDropZone.addEventListener('drop', function(event) {
    scanQrImage(event.dataTransfer && event.dataTransfer.files[0]);
  });
  document.addEventListener('paste', function(event) {
    if (document.getElementById('qr-code-tool').hidden) return;
    var items = event.clipboardData && event.clipboardData.items;
    if (!items) return;
    for (var index = 0; index < items.length; index += 1) {
      if (items[index].type.indexOf('image/') === 0) {
        scanQrImage(items[index].getAsFile());
        break;
      }
    }
  });
  document.getElementById('qr-copy-result').addEventListener('click', function() {
    copyText(qrResult.value, qrScanStatus, '已复制二维码文字。');
  });
  document.getElementById('qr-scan-clear').addEventListener('click', function() {
    qrResult.value = '';
    document.getElementById('qr-scan-preview').hidden = true;
    qrScanCanvas.width = 1;
    qrScanCanvas.height = 1;
    setStatus(qrScanStatus, '', '');
  });

  renderTime(Date.now());
  renderColorPalette('#0284C7');
  updateUtf8FormatHelp();
})();
