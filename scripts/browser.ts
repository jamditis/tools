#!/usr/bin/env npx tsx
/**
 * browser.ts - Full-featured Playwright CLI Tool
 *
 * A single CLI tool exposing all major Playwright functionality.
 * Run with: npx tsx browser.ts <command> [options]
 *
 * Commands are organized by category:
 * - Navigation: goto, back, forward, reload
 * - Interaction: click, fill, type, hover, focus, blur, check, uncheck, select
 * - Content: screenshot, pdf, content, evaluate, title, url
 * - Elements: query, queryAll, waitFor, visible, enabled, checked, getAttribute, textContent
 * - Mouse: mouseMove, mouseClick, mouseDrag, mouseWheel
 * - Keyboard: keyPress, keyType
 * - Page: newPage, closePage, pages, bringToFront
 * - Cookies: getCookies, setCookie, clearCookies
 * - Storage: localStorage, sessionStorage, clearStorage
 * - Network: route, unroute, waitForResponse, waitForRequest
 * - Files: upload, download, setDownloadPath
 * - Dialogs: handleDialog
 * - Emulation: viewport, geolocation, permissions, colorScheme, offline
 * - Tracing: startTracing, stopTracing
 * - Console: console
 * - Browser: launch, close, contexts, newContext
 */

import { chromium, firefox, webkit, Browser, BrowserContext, Page, ElementHandle, Dialog, ConsoleMessage, Route, Request, Response } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// State management - persist browser session
interface BrowserState {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  pages: Map<string, Page>;
  dialogs: Dialog[];
  consoleMessages: ConsoleMessage[];
  downloadPath: string;
  routes: Map<string, (route: Route) => void>;
}

const STATE_FILE = '/tmp/playwright-cli-state.json';

const state: BrowserState = {
  browser: null,
  context: null,
  page: null,
  pages: new Map(),
  dialogs: [],
  consoleMessages: [],
  downloadPath: '/tmp/downloads',
  routes: new Map(),
};

// Result output helper
function output(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

function success(message: string, data?: any): void {
  output({ success: true, message, ...data });
}

function error(message: string, details?: any): void {
  output({ success: false, error: message, ...details });
  process.exit(1);
}

// State persistence for session continuity
interface PersistedState {
  wsEndpoint?: string;
  contextId?: string;
  pageUrl?: string;
}

async function saveState(): Promise<void> {
  if (state.browser) {
    const persistedState: PersistedState = {
      wsEndpoint: (state.browser as any).wsEndpoint?.() || undefined,
      pageUrl: state.page ? await state.page.url() : undefined,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(persistedState));
  }
}

async function loadState(): Promise<boolean> {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const persistedState: PersistedState = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      if (persistedState.wsEndpoint) {
        state.browser = await chromium.connect(persistedState.wsEndpoint);
        const contexts = state.browser.contexts();
        if (contexts.length > 0) {
          state.context = contexts[0];
          const pages = state.context.pages();
          if (pages.length > 0) {
            state.page = pages[0];
            return true;
          }
        }
      }
    }
  } catch (e) {
    // State file invalid or browser disconnected
    try { fs.unlinkSync(STATE_FILE); } catch { }
  }
  return false;
}

// Ensure browser is running
async function ensureBrowser(browserType: string = 'chromium', headless: boolean = true): Promise<void> {
  if (!state.browser) {
    const launcher = browserType === 'firefox' ? firefox : browserType === 'webkit' ? webkit : chromium;
    state.browser = await launcher.launch({ headless });
  }
  if (!state.context) {
    state.context = await state.browser.newContext({
      acceptDownloads: true,
    });
    // Set up console message collection
    state.context.on('console', (msg) => {
      state.consoleMessages.push(msg);
      if (state.consoleMessages.length > 100) state.consoleMessages.shift();
    });
  }
  if (!state.page) {
    state.page = await state.context.newPage();
    state.pages.set('main', state.page);
    // Set up dialog handling
    state.page.on('dialog', (dialog) => {
      state.dialogs.push(dialog);
    });
  }
}

async function ensurePage(): Promise<Page> {
  await ensureBrowser();
  return state.page!;
}

// ============================================================================
// NAVIGATION COMMANDS
// ============================================================================

async function cmdGoto(url: string, options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
  const page = await ensurePage();
  const response = await page.goto(url, {
    timeout: options?.timeout || 30000,
    waitUntil: options?.waitUntil || 'load',
  });
  success('Navigated to URL', {
    url: await page.url(),
    status: response?.status(),
    statusText: response?.statusText(),
  });
}

async function cmdBack(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
  const page = await ensurePage();
  await page.goBack(options);
  success('Navigated back', { url: await page.url() });
}

async function cmdForward(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
  const page = await ensurePage();
  await page.goForward(options);
  success('Navigated forward', { url: await page.url() });
}

async function cmdReload(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
  const page = await ensurePage();
  await page.reload(options);
  success('Page reloaded', { url: await page.url() });
}

// ============================================================================
// INTERACTION COMMANDS
// ============================================================================

async function cmdClick(selector: string, options?: { button?: 'left' | 'right' | 'middle'; clickCount?: number; delay?: number; force?: boolean; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[]; position?: { x: number; y: number }; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.click(selector, options);
  success('Clicked element', { selector });
}

async function cmdDblClick(selector: string, options?: { button?: 'left' | 'right' | 'middle'; delay?: number; force?: boolean; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[]; position?: { x: number; y: number }; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.dblclick(selector, options);
  success('Double-clicked element', { selector });
}

async function cmdFill(selector: string, value: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.fill(selector, value, options);
  success('Filled input', { selector, value });
}

async function cmdType(selector: string, text: string, options?: { delay?: number; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.type(selector, text, options);
  success('Typed text', { selector, text });
}

async function cmdHover(selector: string, options?: { force?: boolean; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[]; position?: { x: number; y: number }; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.hover(selector, options);
  success('Hovered over element', { selector });
}

async function cmdFocus(selector: string, options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.focus(selector, options);
  success('Focused element', { selector });
}

async function cmdBlur(selector: string): Promise<void> {
  const page = await ensurePage();
  await page.$eval(selector, (el: any) => el.blur());
  success('Blurred element', { selector });
}

async function cmdCheck(selector: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.check(selector, options);
  success('Checked element', { selector });
}

async function cmdUncheck(selector: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.uncheck(selector, options);
  success('Unchecked element', { selector });
}

async function cmdSelectOption(selector: string, values: string | string[], options?: { force?: boolean; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  const selected = await page.selectOption(selector, values, options);
  success('Selected option(s)', { selector, selected });
}

async function cmdSetInputFiles(selector: string, files: string | string[], options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.setInputFiles(selector, files, options);
  success('Set input files', { selector, files });
}

async function cmdDragAndDrop(source: string, target: string, options?: { force?: boolean; sourcePosition?: { x: number; y: number }; targetPosition?: { x: number; y: number }; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.dragAndDrop(source, target, options);
  success('Drag and drop completed', { source, target });
}

async function cmdTap(selector: string, options?: { force?: boolean; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[]; position?: { x: number; y: number }; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.tap(selector, options);
  success('Tapped element', { selector });
}

// ============================================================================
// CONTENT COMMANDS
// ============================================================================

async function cmdScreenshot(path?: string, options?: { fullPage?: boolean; clip?: { x: number; y: number; width: number; height: number }; quality?: number; type?: 'png' | 'jpeg' }): Promise<void> {
  const page = await ensurePage();
  const screenshotPath = path || `/tmp/screenshot-${Date.now()}.png`;
  await page.screenshot({
    path: screenshotPath,
    fullPage: options?.fullPage ?? false,
    clip: options?.clip,
    quality: options?.quality,
    type: options?.type || 'png',
  });
  success('Screenshot saved', { path: screenshotPath });
}

async function cmdElementScreenshot(selector: string, path?: string, options?: { quality?: number; type?: 'png' | 'jpeg' }): Promise<void> {
  const page = await ensurePage();
  const element = await page.$(selector);
  if (!element) {
    error('Element not found', { selector });
    return;
  }
  const screenshotPath = path || `/tmp/element-screenshot-${Date.now()}.png`;
  await element.screenshot({
    path: screenshotPath,
    quality: options?.quality,
    type: options?.type || 'png',
  });
  success('Element screenshot saved', { selector, path: screenshotPath });
}

async function cmdPdf(path?: string, options?: { displayHeaderFooter?: boolean; footerTemplate?: string; format?: string; headerTemplate?: string; height?: string | number; landscape?: boolean; margin?: { top?: string | number; right?: string | number; bottom?: string | number; left?: string | number }; pageRanges?: string; preferCSSPageSize?: boolean; printBackground?: boolean; scale?: number; width?: string | number }): Promise<void> {
  const page = await ensurePage();
  const pdfPath = path || `/tmp/page-${Date.now()}.pdf`;
  await page.pdf({
    path: pdfPath,
    ...options,
  });
  success('PDF saved', { path: pdfPath });
}

async function cmdContent(): Promise<void> {
  const page = await ensurePage();
  const content = await page.content();
  success('Page content retrieved', { content });
}

async function cmdSetContent(html: string, options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
  const page = await ensurePage();
  await page.setContent(html, options);
  success('Page content set');
}

async function cmdTitle(): Promise<void> {
  const page = await ensurePage();
  const title = await page.title();
  success('Page title', { title });
}

async function cmdUrl(): Promise<void> {
  const page = await ensurePage();
  const url = await page.url();
  success('Page URL', { url });
}

async function cmdEvaluate(expression: string): Promise<void> {
  const page = await ensurePage();
  const result = await page.evaluate(expression);
  success('Evaluation result', { result });
}

async function cmdEvaluateHandle(expression: string): Promise<void> {
  const page = await ensurePage();
  const handle = await page.evaluateHandle(expression);
  const result = await handle.jsonValue();
  success('Evaluation handle result', { result });
}

// ============================================================================
// ELEMENT COMMANDS
// ============================================================================

async function cmdQuery(selector: string): Promise<void> {
  const page = await ensurePage();
  const element = await page.$(selector);
  if (element) {
    const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
    const text = await element.textContent();
    const attributes = await element.evaluate((el) => {
      const attrs: Record<string, string> = {};
      for (const attr of el.attributes) {
        attrs[attr.name] = attr.value;
      }
      return attrs;
    });
    success('Element found', { selector, tagName, text: text?.slice(0, 200), attributes });
  } else {
    success('Element not found', { selector, found: false });
  }
}

async function cmdQueryAll(selector: string): Promise<void> {
  const page = await ensurePage();
  const elements = await page.$$(selector);
  const results = await Promise.all(elements.slice(0, 50).map(async (el, i) => {
    const tagName = await el.evaluate((e) => e.tagName.toLowerCase());
    const text = await el.textContent();
    return { index: i, tagName, text: text?.slice(0, 100) };
  }));
  success('Elements found', { selector, count: elements.length, elements: results });
}

async function cmdWaitForSelector(selector: string, options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number }): Promise<void> {
  const page = await ensurePage();
  await page.waitForSelector(selector, options);
  success('Element appeared', { selector });
}

async function cmdWaitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle'): Promise<void> {
  const page = await ensurePage();
  await page.waitForLoadState(state);
  success('Load state reached', { state: state || 'load' });
}

async function cmdWaitForTimeout(timeout: number): Promise<void> {
  const page = await ensurePage();
  await page.waitForTimeout(timeout);
  success('Timeout completed', { timeout });
}

async function cmdWaitForUrl(url: string | RegExp, options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
  const page = await ensurePage();
  await page.waitForURL(url, options);
  success('URL matched', { url: String(url) });
}

async function cmdWaitForFunction(expression: string, options?: { timeout?: number; polling?: number | 'raf' }): Promise<void> {
  const page = await ensurePage();
  await page.waitForFunction(expression, undefined, options);
  success('Function returned truthy', { expression });
}

async function cmdIsVisible(selector: string): Promise<void> {
  const page = await ensurePage();
  const visible = await page.isVisible(selector);
  success('Visibility check', { selector, visible });
}

async function cmdIsEnabled(selector: string): Promise<void> {
  const page = await ensurePage();
  const enabled = await page.isEnabled(selector);
  success('Enabled check', { selector, enabled });
}

async function cmdIsChecked(selector: string): Promise<void> {
  const page = await ensurePage();
  const checked = await page.isChecked(selector);
  success('Checked state', { selector, checked });
}

async function cmdIsHidden(selector: string): Promise<void> {
  const page = await ensurePage();
  const hidden = await page.isHidden(selector);
  success('Hidden state', { selector, hidden });
}

async function cmdIsEditable(selector: string): Promise<void> {
  const page = await ensurePage();
  const editable = await page.isEditable(selector);
  success('Editable state', { selector, editable });
}

async function cmdIsDisabled(selector: string): Promise<void> {
  const page = await ensurePage();
  const disabled = await page.isDisabled(selector);
  success('Disabled state', { selector, disabled });
}

async function cmdGetAttribute(selector: string, name: string): Promise<void> {
  const page = await ensurePage();
  const value = await page.getAttribute(selector, name);
  success('Attribute value', { selector, attribute: name, value });
}

async function cmdTextContent(selector: string): Promise<void> {
  const page = await ensurePage();
  const text = await page.textContent(selector);
  success('Text content', { selector, text });
}

async function cmdInnerText(selector: string): Promise<void> {
  const page = await ensurePage();
  const text = await page.innerText(selector);
  success('Inner text', { selector, text });
}

async function cmdInnerHTML(selector: string): Promise<void> {
  const page = await ensurePage();
  const html = await page.innerHTML(selector);
  success('Inner HTML', { selector, html });
}

async function cmdInputValue(selector: string): Promise<void> {
  const page = await ensurePage();
  const value = await page.inputValue(selector);
  success('Input value', { selector, value });
}

async function cmdBoundingBox(selector: string): Promise<void> {
  const page = await ensurePage();
  const element = await page.$(selector);
  if (!element) {
    error('Element not found', { selector });
    return;
  }
  const box = await element.boundingBox();
  success('Bounding box', { selector, box });
}

async function cmdCount(selector: string): Promise<void> {
  const page = await ensurePage();
  const count = await page.locator(selector).count();
  success('Element count', { selector, count });
}

// ============================================================================
// MOUSE COMMANDS
// ============================================================================

async function cmdMouseMove(x: number, y: number, options?: { steps?: number }): Promise<void> {
  const page = await ensurePage();
  await page.mouse.move(x, y, options);
  success('Mouse moved', { x, y });
}

async function cmdMouseClick(x: number, y: number, options?: { button?: 'left' | 'right' | 'middle'; clickCount?: number; delay?: number }): Promise<void> {
  const page = await ensurePage();
  await page.mouse.click(x, y, options);
  success('Mouse clicked', { x, y, button: options?.button || 'left' });
}

async function cmdMouseDblClick(x: number, y: number, options?: { button?: 'left' | 'right' | 'middle'; delay?: number }): Promise<void> {
  const page = await ensurePage();
  await page.mouse.dblclick(x, y, options);
  success('Mouse double-clicked', { x, y });
}

async function cmdMouseDown(options?: { button?: 'left' | 'right' | 'middle'; clickCount?: number }): Promise<void> {
  const page = await ensurePage();
  await page.mouse.down(options);
  success('Mouse button pressed', { button: options?.button || 'left' });
}

async function cmdMouseUp(options?: { button?: 'left' | 'right' | 'middle'; clickCount?: number }): Promise<void> {
  const page = await ensurePage();
  await page.mouse.up(options);
  success('Mouse button released', { button: options?.button || 'left' });
}

async function cmdMouseWheel(deltaX: number, deltaY: number): Promise<void> {
  const page = await ensurePage();
  await page.mouse.wheel(deltaX, deltaY);
  success('Mouse wheel scrolled', { deltaX, deltaY });
}

// ============================================================================
// KEYBOARD COMMANDS
// ============================================================================

async function cmdKeyPress(key: string, options?: { delay?: number }): Promise<void> {
  const page = await ensurePage();
  await page.keyboard.press(key, options);
  success('Key pressed', { key });
}

async function cmdKeyType(text: string, options?: { delay?: number }): Promise<void> {
  const page = await ensurePage();
  await page.keyboard.type(text, options);
  success('Text typed', { text });
}

async function cmdKeyDown(key: string): Promise<void> {
  const page = await ensurePage();
  await page.keyboard.down(key);
  success('Key down', { key });
}

async function cmdKeyUp(key: string): Promise<void> {
  const page = await ensurePage();
  await page.keyboard.up(key);
  success('Key up', { key });
}

async function cmdKeyInsertText(text: string): Promise<void> {
  const page = await ensurePage();
  await page.keyboard.insertText(text);
  success('Text inserted', { text });
}

// ============================================================================
// PAGE MANAGEMENT COMMANDS
// ============================================================================

async function cmdNewPage(name?: string): Promise<void> {
  await ensureBrowser();
  const page = await state.context!.newPage();
  const pageName = name || `page-${state.pages.size}`;
  state.pages.set(pageName, page);
  state.page = page;
  success('New page created', { name: pageName, totalPages: state.pages.size });
}

async function cmdClosePage(name?: string): Promise<void> {
  if (name) {
    const page = state.pages.get(name);
    if (page) {
      await page.close();
      state.pages.delete(name);
      if (state.page === page) {
        state.page = state.pages.values().next().value || null;
      }
      success('Page closed', { name });
    } else {
      error('Page not found', { name });
    }
  } else if (state.page) {
    await state.page.close();
    // Find and remove from map
    for (const [n, p] of state.pages) {
      if (p === state.page) {
        state.pages.delete(n);
        break;
      }
    }
    state.page = state.pages.values().next().value || null;
    success('Current page closed');
  }
}

async function cmdSwitchPage(name: string): Promise<void> {
  const page = state.pages.get(name);
  if (page) {
    state.page = page;
    success('Switched to page', { name, url: await page.url() });
  } else {
    error('Page not found', { name, available: Array.from(state.pages.keys()) });
  }
}

async function cmdListPages(): Promise<void> {
  const pages = await Promise.all(
    Array.from(state.pages.entries()).map(async ([name, page]) => ({
      name,
      url: await page.url(),
      title: await page.title(),
      isCurrent: page === state.page,
    }))
  );
  success('Pages', { pages });
}

async function cmdBringToFront(): Promise<void> {
  const page = await ensurePage();
  await page.bringToFront();
  success('Page brought to front');
}

// ============================================================================
// FRAME COMMANDS
// ============================================================================

async function cmdFrames(): Promise<void> {
  const page = await ensurePage();
  const frames = page.frames().map((f, i) => ({
    index: i,
    name: f.name(),
    url: f.url(),
  }));
  success('Frames', { frames });
}

async function cmdFrameLocator(selector: string): Promise<void> {
  const page = await ensurePage();
  const frameLocator = page.frameLocator(selector);
  success('Frame locator created', { selector });
}

// ============================================================================
// COOKIE COMMANDS
// ============================================================================

async function cmdGetCookies(urls?: string[]): Promise<void> {
  await ensureBrowser();
  const cookies = await state.context!.cookies(urls);
  success('Cookies', { cookies });
}

async function cmdSetCookie(cookie: { name: string; value: string; url?: string; domain?: string; path?: string; expires?: number; httpOnly?: boolean; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' }): Promise<void> {
  await ensureBrowser();
  await state.context!.addCookies([cookie]);
  success('Cookie set', { name: cookie.name });
}

async function cmdClearCookies(): Promise<void> {
  await ensureBrowser();
  await state.context!.clearCookies();
  success('Cookies cleared');
}

// ============================================================================
// STORAGE COMMANDS
// ============================================================================

async function cmdLocalStorage(action: 'get' | 'set' | 'remove' | 'clear', key?: string, value?: string): Promise<void> {
  const page = await ensurePage();
  switch (action) {
    case 'get':
      if (key) {
        const val = await page.evaluate((k) => localStorage.getItem(k), key);
        success('LocalStorage value', { key, value: val });
      } else {
        const all = await page.evaluate(() => ({ ...localStorage }));
        success('LocalStorage', { items: all });
      }
      break;
    case 'set':
      if (key && value !== undefined) {
        await page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
        success('LocalStorage set', { key, value });
      }
      break;
    case 'remove':
      if (key) {
        await page.evaluate((k) => localStorage.removeItem(k), key);
        success('LocalStorage item removed', { key });
      }
      break;
    case 'clear':
      await page.evaluate(() => localStorage.clear());
      success('LocalStorage cleared');
      break;
  }
}

async function cmdSessionStorage(action: 'get' | 'set' | 'remove' | 'clear', key?: string, value?: string): Promise<void> {
  const page = await ensurePage();
  switch (action) {
    case 'get':
      if (key) {
        const val = await page.evaluate((k) => sessionStorage.getItem(k), key);
        success('SessionStorage value', { key, value: val });
      } else {
        const all = await page.evaluate(() => ({ ...sessionStorage }));
        success('SessionStorage', { items: all });
      }
      break;
    case 'set':
      if (key && value !== undefined) {
        await page.evaluate(({ k, v }) => sessionStorage.setItem(k, v), { k: key, v: value });
        success('SessionStorage set', { key, value });
      }
      break;
    case 'remove':
      if (key) {
        await page.evaluate((k) => sessionStorage.removeItem(k), key);
        success('SessionStorage item removed', { key });
      }
      break;
    case 'clear':
      await page.evaluate(() => sessionStorage.clear());
      success('SessionStorage cleared');
      break;
  }
}

async function cmdStorageState(path?: string): Promise<void> {
  await ensureBrowser();
  const storageState = await state.context!.storageState({ path });
  if (path) {
    success('Storage state saved', { path });
  } else {
    success('Storage state', { storageState });
  }
}

// ============================================================================
// NETWORK COMMANDS
// ============================================================================

async function cmdRoute(pattern: string, action: 'abort' | 'fulfill' | 'continue', options?: { status?: number; body?: string; contentType?: string }): Promise<void> {
  await ensureBrowser();
  const handler = async (route: Route) => {
    switch (action) {
      case 'abort':
        await route.abort();
        break;
      case 'fulfill':
        await route.fulfill({
          status: options?.status || 200,
          body: options?.body || '',
          contentType: options?.contentType || 'text/plain',
        });
        break;
      case 'continue':
        await route.continue();
        break;
    }
  };
  state.routes.set(pattern, handler);
  await state.context!.route(pattern, handler);
  success('Route added', { pattern, action });
}

async function cmdUnroute(pattern: string): Promise<void> {
  await ensureBrowser();
  const handler = state.routes.get(pattern);
  if (handler) {
    await state.context!.unroute(pattern, handler);
    state.routes.delete(pattern);
    success('Route removed', { pattern });
  } else {
    error('Route not found', { pattern });
  }
}

async function cmdWaitForResponse(urlOrPredicate: string, options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  const response = await page.waitForResponse(urlOrPredicate, options);
  success('Response received', {
    url: response.url(),
    status: response.status(),
    statusText: response.statusText(),
    headers: response.headers(),
  });
}

async function cmdWaitForRequest(urlOrPredicate: string, options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  const request = await page.waitForRequest(urlOrPredicate, options);
  success('Request made', {
    url: request.url(),
    method: request.method(),
    headers: request.headers(),
    postData: request.postData(),
  });
}

async function cmdSetExtraHTTPHeaders(headers: Record<string, string>): Promise<void> {
  await ensureBrowser();
  await state.context!.setExtraHTTPHeaders(headers);
  success('Extra HTTP headers set', { headers });
}

async function cmdSetOffline(offline: boolean): Promise<void> {
  await ensureBrowser();
  await state.context!.setOffline(offline);
  success('Offline mode', { offline });
}

// ============================================================================
// FILE COMMANDS
// ============================================================================

async function cmdUpload(selector: string, files: string | string[]): Promise<void> {
  const page = await ensurePage();
  await page.setInputFiles(selector, files);
  success('Files uploaded', { selector, files });
}

async function cmdDownload(url: string, path?: string): Promise<void> {
  const page = await ensurePage();
  const downloadPromise = page.waitForEvent('download');
  await page.goto(url);
  const download = await downloadPromise;
  const savePath = path || `${state.downloadPath}/${download.suggestedFilename()}`;
  await download.saveAs(savePath);
  success('File downloaded', { path: savePath, suggestedFilename: download.suggestedFilename() });
}

async function cmdSetDownloadPath(path: string): Promise<void> {
  state.downloadPath = path;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  success('Download path set', { path });
}

async function cmdExpectDownload(action: string, savePath?: string): Promise<void> {
  const page = await ensurePage();
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(action);
  const download = await downloadPromise;
  const finalPath = savePath || `${state.downloadPath}/${download.suggestedFilename()}`;
  await download.saveAs(finalPath);
  success('Download completed', { path: finalPath, suggestedFilename: download.suggestedFilename() });
}

// ============================================================================
// DIALOG COMMANDS
// ============================================================================

async function cmdHandleDialog(action: 'accept' | 'dismiss', promptText?: string): Promise<void> {
  const page = await ensurePage();
  page.once('dialog', async (dialog) => {
    if (action === 'accept') {
      await dialog.accept(promptText);
    } else {
      await dialog.dismiss();
    }
  });
  success('Dialog handler set', { action, promptText });
}

async function cmdGetDialogs(): Promise<void> {
  const dialogs = state.dialogs.map((d) => ({
    type: d.type(),
    message: d.message(),
    defaultValue: d.defaultValue(),
  }));
  success('Dialogs', { dialogs });
}

// ============================================================================
// EMULATION COMMANDS
// ============================================================================

async function cmdViewport(width: number, height: number): Promise<void> {
  const page = await ensurePage();
  await page.setViewportSize({ width, height });
  success('Viewport set', { width, height });
}

async function cmdGeolocation(latitude: number, longitude: number, accuracy?: number): Promise<void> {
  await ensureBrowser();
  await state.context!.setGeolocation({ latitude, longitude, accuracy });
  success('Geolocation set', { latitude, longitude, accuracy });
}

async function cmdPermissions(permissions: string[], origin?: string): Promise<void> {
  await ensureBrowser();
  await state.context!.grantPermissions(permissions, origin ? { origin } : undefined);
  success('Permissions granted', { permissions, origin });
}

async function cmdColorScheme(colorScheme: 'light' | 'dark' | 'no-preference'): Promise<void> {
  const page = await ensurePage();
  await page.emulateMedia({ colorScheme });
  success('Color scheme set', { colorScheme });
}

async function cmdMedia(media: 'screen' | 'print' | null): Promise<void> {
  const page = await ensurePage();
  await page.emulateMedia({ media });
  success('Media type set', { media });
}

async function cmdReducedMotion(reducedMotion: 'reduce' | 'no-preference'): Promise<void> {
  const page = await ensurePage();
  await page.emulateMedia({ reducedMotion });
  success('Reduced motion set', { reducedMotion });
}

async function cmdForcedColors(forcedColors: 'active' | 'none'): Promise<void> {
  const page = await ensurePage();
  await page.emulateMedia({ forcedColors });
  success('Forced colors set', { forcedColors });
}

async function cmdTimezone(timezoneId: string): Promise<void> {
  await ensureBrowser();
  // Need to create new context with timezone
  const oldContext = state.context;
  state.context = await state.browser!.newContext({
    timezoneId,
    acceptDownloads: true,
  });
  state.page = await state.context.newPage();
  state.pages.set('main', state.page);
  if (oldContext) await oldContext.close();
  success('Timezone set', { timezoneId });
}

async function cmdLocale(locale: string): Promise<void> {
  await ensureBrowser();
  // Need to create new context with locale
  const oldContext = state.context;
  state.context = await state.browser!.newContext({
    locale,
    acceptDownloads: true,
  });
  state.page = await state.context.newPage();
  state.pages.set('main', state.page);
  if (oldContext) await oldContext.close();
  success('Locale set', { locale });
}

async function cmdUserAgent(userAgent: string): Promise<void> {
  await ensureBrowser();
  // Need to create new context with user agent
  const oldContext = state.context;
  state.context = await state.browser!.newContext({
    userAgent,
    acceptDownloads: true,
  });
  state.page = await state.context.newPage();
  state.pages.set('main', state.page);
  if (oldContext) await oldContext.close();
  success('User agent set', { userAgent });
}

// ============================================================================
// TRACING COMMANDS
// ============================================================================

async function cmdStartTracing(options?: { screenshots?: boolean; snapshots?: boolean; sources?: boolean }): Promise<void> {
  await ensureBrowser();
  await state.context!.tracing.start({
    screenshots: options?.screenshots ?? true,
    snapshots: options?.snapshots ?? true,
    sources: options?.sources ?? false,
  });
  success('Tracing started');
}

async function cmdStopTracing(path?: string): Promise<void> {
  await ensureBrowser();
  const tracePath = path || `/tmp/trace-${Date.now()}.zip`;
  await state.context!.tracing.stop({ path: tracePath });
  success('Tracing stopped', { path: tracePath });
}

// ============================================================================
// CONSOLE COMMANDS
// ============================================================================

async function cmdGetConsole(clear?: boolean): Promise<void> {
  const messages = state.consoleMessages.map((m) => ({
    type: m.type(),
    text: m.text(),
    location: m.location(),
  }));
  if (clear) {
    state.consoleMessages = [];
  }
  success('Console messages', { messages, count: messages.length });
}

// ============================================================================
// BROWSER COMMANDS
// ============================================================================

async function cmdLaunch(browserType?: string, headless?: boolean): Promise<void> {
  const type = browserType || 'chromium';
  const launcher = type === 'firefox' ? firefox : type === 'webkit' ? webkit : chromium;

  // Close existing browser if any
  if (state.browser) {
    await state.browser.close();
  }

  state.browser = await launcher.launch({
    headless: headless ?? true,
  });
  state.context = await state.browser.newContext({ acceptDownloads: true });
  state.page = await state.context.newPage();
  state.pages.set('main', state.page);

  success('Browser launched', { type, headless: headless ?? true });
}

async function cmdClose(): Promise<void> {
  if (state.browser) {
    await state.browser.close();
    state.browser = null;
    state.context = null;
    state.page = null;
    state.pages.clear();
    try { fs.unlinkSync(STATE_FILE); } catch { }
    success('Browser closed');
  } else {
    success('No browser to close');
  }
}

async function cmdContexts(): Promise<void> {
  if (state.browser) {
    const contexts = state.browser.contexts();
    success('Browser contexts', { count: contexts.length });
  } else {
    error('No browser running');
  }
}

async function cmdNewContext(options?: { viewport?: { width: number; height: number }; userAgent?: string; locale?: string; timezoneId?: string; geolocation?: { latitude: number; longitude: number }; permissions?: string[]; colorScheme?: 'light' | 'dark' | 'no-preference' }): Promise<void> {
  await ensureBrowser();
  const oldContext = state.context;
  state.context = await state.browser!.newContext({
    acceptDownloads: true,
    ...options,
  });
  state.page = await state.context.newPage();
  state.pages.clear();
  state.pages.set('main', state.page);
  if (oldContext) await oldContext.close();
  success('New context created', { options });
}

async function cmdCloseContext(): Promise<void> {
  if (state.context) {
    await state.context.close();
    state.context = null;
    state.page = null;
    state.pages.clear();
    success('Context closed');
  } else {
    error('No context to close');
  }
}

// ============================================================================
// ACCESSIBILITY COMMANDS
// ============================================================================

async function cmdAccessibilitySnapshot(options?: { root?: string }): Promise<void> {
  const page = await ensurePage();
  const snapshot = await page
    .locator(options?.root || 'html')
    .first()
    .ariaSnapshot();
  success('Accessibility snapshot', { snapshot });
}

// ============================================================================
// ASSERTIONS/EXPECT COMMANDS
// ============================================================================

async function cmdExpectText(selector: string, expected: string, options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  const locator = page.locator(selector);
  try {
    const text = await locator.textContent({ timeout: options?.timeout || 5000 });
    const matches = text?.includes(expected);
    success('Text assertion', { selector, expected, actual: text, matches });
  } catch (e: any) {
    error('Text assertion failed', { selector, expected, error: e.message });
  }
}

async function cmdExpectValue(selector: string, expected: string, options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  try {
    const value = await page.inputValue(selector, { timeout: options?.timeout || 5000 });
    const matches = value === expected;
    success('Value assertion', { selector, expected, actual: value, matches });
  } catch (e: any) {
    error('Value assertion failed', { selector, expected, error: e.message });
  }
}

async function cmdExpectAttribute(selector: string, name: string, expected: string, options?: { timeout?: number }): Promise<void> {
  const page = await ensurePage();
  try {
    const value = await page.getAttribute(selector, name, { timeout: options?.timeout || 5000 });
    const matches = value === expected;
    success('Attribute assertion', { selector, attribute: name, expected, actual: value, matches });
  } catch (e: any) {
    error('Attribute assertion failed', { selector, attribute: name, expected, error: e.message });
  }
}

// ============================================================================
// LOCATOR COMMANDS
// ============================================================================

async function cmdLocator(selector: string, action?: string, ...args: any[]): Promise<void> {
  const page = await ensurePage();
  const locator = page.locator(selector);

  if (!action) {
    const count = await locator.count();
    success('Locator info', { selector, count });
    return;
  }

  // Handle various locator actions
  switch (action) {
    case 'first':
      const first = locator.first();
      success('First element', { selector, text: await first.textContent() });
      break;
    case 'last':
      const last = locator.last();
      success('Last element', { selector, text: await last.textContent() });
      break;
    case 'nth':
      const nth = locator.nth(parseInt(args[0]) || 0);
      success('Nth element', { selector, index: args[0], text: await nth.textContent() });
      break;
    case 'filter':
      const filtered = locator.filter({ hasText: args[0] });
      success('Filtered elements', { selector, filter: args[0], count: await filtered.count() });
      break;
    case 'all':
      const all = await locator.all();
      const texts = await Promise.all(all.map(async (l) => await l.textContent()));
      success('All elements', { selector, count: all.length, texts: texts.slice(0, 20) });
      break;
    default:
      error('Unknown locator action', { action });
  }
}

async function cmdGetByRole(role: string, options?: { name?: string; exact?: boolean }): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByRole(role as any, options);
  const count = await locator.count();
  success('Elements by role', { role, options, count });
}

async function cmdGetByText(text: string, options?: { exact?: boolean }): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByText(text, options);
  const count = await locator.count();
  success('Elements by text', { text, options, count });
}

async function cmdGetByLabel(text: string, options?: { exact?: boolean }): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByLabel(text, options);
  const count = await locator.count();
  success('Elements by label', { text, options, count });
}

async function cmdGetByPlaceholder(text: string, options?: { exact?: boolean }): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByPlaceholder(text, options);
  const count = await locator.count();
  success('Elements by placeholder', { text, options, count });
}

async function cmdGetByTestId(testId: string): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByTestId(testId);
  const count = await locator.count();
  success('Elements by test ID', { testId, count });
}

async function cmdGetByAltText(text: string, options?: { exact?: boolean }): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByAltText(text, options);
  const count = await locator.count();
  success('Elements by alt text', { text, options, count });
}

async function cmdGetByTitle(text: string, options?: { exact?: boolean }): Promise<void> {
  const page = await ensurePage();
  const locator = page.getByTitle(text, options);
  const count = await locator.count();
  success('Elements by title', { text, options, count });
}

// ============================================================================
// HELP/STATUS COMMANDS
// ============================================================================

async function cmdStatus(): Promise<void> {
  const status = {
    browserRunning: !!state.browser,
    contextActive: !!state.context,
    pageActive: !!state.page,
    pageCount: state.pages.size,
    currentUrl: state.page ? await state.page.url() : null,
    consoleMessagesCount: state.consoleMessages.length,
    routesCount: state.routes.size,
    downloadPath: state.downloadPath,
  };
  success('Browser status', status);
}

function cmdHelp(): void {
  const help = `
Playwright CLI Tool - Full Browser Automation

USAGE: npx tsx browser.ts <command> [options...]

NAVIGATION:
  goto <url> [--timeout=ms] [--waitUntil=state]  Navigate to URL
  back [--timeout=ms]                             Go back
  forward [--timeout=ms]                          Go forward
  reload [--timeout=ms]                           Reload page

INTERACTION:
  click <selector> [--force] [--timeout=ms]       Click element
  dblclick <selector>                             Double-click
  fill <selector> <value>                         Fill input field
  type <selector> <text> [--delay=ms]             Type text with delay
  hover <selector>                                Hover over element
  focus <selector>                                Focus element
  blur <selector>                                 Blur element
  check <selector>                                Check checkbox
  uncheck <selector>                              Uncheck checkbox
  select <selector> <value>                       Select option
  upload <selector> <file>                        Upload file
  dragdrop <source> <target>                      Drag and drop
  tap <selector>                                  Tap (touch)

CONTENT:
  screenshot [path] [--fullPage]                  Take screenshot
  elementScreenshot <selector> [path]             Screenshot element
  pdf [path] [--landscape]                        Generate PDF
  content                                         Get page HTML
  setContent <html>                               Set page HTML
  title                                           Get page title
  url                                             Get page URL
  evaluate <expression>                           Evaluate JavaScript

ELEMENTS:
  query <selector>                                Find single element
  queryAll <selector>                             Find all elements
  waitFor <selector> [--state=visible]            Wait for element
  waitForLoadState [state]                        Wait for load state
  waitForTimeout <ms>                             Wait for time
  waitForUrl <url>                                Wait for URL
  waitForFunction <expr>                          Wait for function
  isVisible <selector>                            Check visibility
  isEnabled <selector>                            Check enabled
  isChecked <selector>                            Check checked
  isHidden <selector>                             Check hidden
  isEditable <selector>                           Check editable
  isDisabled <selector>                           Check disabled
  getAttribute <selector> <name>                  Get attribute
  textContent <selector>                          Get text content
  innerText <selector>                            Get inner text
  innerHTML <selector>                            Get inner HTML
  inputValue <selector>                           Get input value
  boundingBox <selector>                          Get bounding box
  count <selector>                                Count elements

MOUSE:
  mouseMove <x> <y>                               Move mouse
  mouseClick <x> <y> [--button=left]              Click at position
  mouseDblClick <x> <y>                           Double-click at pos
  mouseDown [--button=left]                       Press mouse button
  mouseUp [--button=left]                         Release mouse button
  mouseWheel <deltaX> <deltaY>                    Scroll wheel

KEYBOARD:
  keyPress <key>                                  Press key
  keyType <text>                                  Type text
  keyDown <key>                                   Press key down
  keyUp <key>                                     Release key
  keyInsertText <text>                            Insert text

PAGES:
  newPage [name]                                  Create new page
  closePage [name]                                Close page
  switchPage <name>                               Switch to page
  listPages                                       List all pages
  bringToFront                                    Focus current page

FRAMES:
  frames                                          List frames
  frameLocator <selector>                         Create frame locator

COOKIES:
  getCookies [urls...]                            Get cookies
  setCookie <json>                                Set cookie
  clearCookies                                    Clear all cookies

STORAGE:
  localStorage <get|set|remove|clear> [key] [val] LocalStorage ops
  sessionStorage <get|set|remove|clear> [key]    SessionStorage ops
  storageState [path]                             Export storage state

NETWORK:
  route <pattern> <abort|fulfill|continue>        Add route handler
  unroute <pattern>                               Remove route
  waitForResponse <url>                           Wait for response
  waitForRequest <url>                            Wait for request
  setExtraHTTPHeaders <json>                      Set extra headers
  setOffline <true|false>                         Toggle offline mode

FILES:
  upload <selector> <file>                        Upload file
  download <url> [path]                           Download file
  setDownloadPath <path>                          Set download dir
  expectDownload <action> [path]                  Expect download

DIALOGS:
  handleDialog <accept|dismiss> [text]            Handle next dialog
  getDialogs                                      Get dialog history

EMULATION:
  viewport <width> <height>                       Set viewport size
  geolocation <lat> <lon> [accuracy]              Set geolocation
  permissions <perm1,perm2> [origin]              Grant permissions
  colorScheme <light|dark>                        Set color scheme
  media <screen|print>                            Set media type
  reducedMotion <reduce|no-preference>            Set motion pref
  forcedColors <active|none>                      Set forced colors
  timezone <id>                                   Set timezone
  locale <locale>                                 Set locale
  userAgent <ua>                                  Set user agent

TRACING:
  startTracing [--screenshots] [--snapshots]      Start trace
  stopTracing [path]                              Stop and save trace

CONSOLE:
  getConsole [--clear]                            Get console logs

LOCATORS:
  locator <selector> [action] [args...]           Locator operations
  getByRole <role> [--name=text]                  Find by ARIA role
  getByText <text> [--exact]                      Find by text
  getByLabel <text>                               Find by label
  getByPlaceholder <text>                         Find by placeholder
  getByTestId <id>                                Find by test-id
  getByAltText <text>                             Find by alt text
  getByTitle <text>                               Find by title

ASSERTIONS:
  expectText <selector> <expected>                Assert text
  expectValue <selector> <expected>               Assert input value
  expectAttribute <sel> <name> <expected>         Assert attribute

ACCESSIBILITY:
  accessibilitySnapshot [--root=selector]         Get a11y tree

BROWSER:
  launch [chromium|firefox|webkit] [--headless]   Launch browser
  close                                           Close browser
  contexts                                        List contexts
  newContext [--viewport=WxH]                     Create context
  closeContext                                    Close context
  status                                          Get browser status
  help                                            Show this help
`;
  console.log(help);
}

// ============================================================================
// CLI PARSER AND MAIN
// ============================================================================

function parseArgs(args: string[]): { flags: Record<string, any>; positional: string[] } {
  const flags: Record<string, any> = {};
  const positional: string[] = [];

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.slice(2).split('=');
      const value = valueParts.join('=');
      if (value === '' || value === 'true') {
        flags[key] = true;
      } else if (value === 'false') {
        flags[key] = false;
      } else if (!isNaN(Number(value))) {
        flags[key] = Number(value);
      } else {
        flags[key] = value;
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    cmdHelp();
    return;
  }

  const command = args[0].toLowerCase();
  const { flags, positional } = parseArgs(args.slice(1));

  try {
    switch (command) {
      // Navigation
      case 'goto':
        await cmdGoto(positional[0], flags);
        break;
      case 'back':
        await cmdBack(flags);
        break;
      case 'forward':
        await cmdForward(flags);
        break;
      case 'reload':
        await cmdReload(flags);
        break;

      // Interaction
      case 'click':
        await cmdClick(positional[0], flags);
        break;
      case 'dblclick':
        await cmdDblClick(positional[0], flags);
        break;
      case 'fill':
        await cmdFill(positional[0], positional[1], flags);
        break;
      case 'type':
        await cmdType(positional[0], positional.slice(1).join(' '), flags);
        break;
      case 'hover':
        await cmdHover(positional[0], flags);
        break;
      case 'focus':
        await cmdFocus(positional[0], flags);
        break;
      case 'blur':
        await cmdBlur(positional[0]);
        break;
      case 'check':
        await cmdCheck(positional[0], flags);
        break;
      case 'uncheck':
        await cmdUncheck(positional[0], flags);
        break;
      case 'select':
        await cmdSelectOption(positional[0], positional.slice(1), flags);
        break;
      case 'upload':
        await cmdUpload(positional[0], positional.slice(1));
        break;
      case 'dragdrop':
        await cmdDragAndDrop(positional[0], positional[1], flags);
        break;
      case 'tap':
        await cmdTap(positional[0], flags);
        break;

      // Content
      case 'screenshot':
        await cmdScreenshot(positional[0], flags);
        break;
      case 'elementscreenshot':
        await cmdElementScreenshot(positional[0], positional[1], flags);
        break;
      case 'pdf':
        await cmdPdf(positional[0], flags);
        break;
      case 'content':
        await cmdContent();
        break;
      case 'setcontent':
        await cmdSetContent(positional.join(' '), flags);
        break;
      case 'title':
        await cmdTitle();
        break;
      case 'url':
        await cmdUrl();
        break;
      case 'evaluate':
      case 'eval':
        await cmdEvaluate(positional.join(' '));
        break;
      case 'evaluatehandle':
        await cmdEvaluateHandle(positional.join(' '));
        break;

      // Elements
      case 'query':
        await cmdQuery(positional[0]);
        break;
      case 'queryall':
        await cmdQueryAll(positional[0]);
        break;
      case 'waitfor':
        await cmdWaitForSelector(positional[0], flags);
        break;
      case 'waitforloadstate':
        await cmdWaitForLoadState(positional[0] as any);
        break;
      case 'waitfortimeout':
        await cmdWaitForTimeout(parseInt(positional[0]) || 1000);
        break;
      case 'waitforurl':
        await cmdWaitForUrl(positional[0], flags);
        break;
      case 'waitforfunction':
        await cmdWaitForFunction(positional.join(' '), flags);
        break;
      case 'isvisible':
        await cmdIsVisible(positional[0]);
        break;
      case 'isenabled':
        await cmdIsEnabled(positional[0]);
        break;
      case 'ischecked':
        await cmdIsChecked(positional[0]);
        break;
      case 'ishidden':
        await cmdIsHidden(positional[0]);
        break;
      case 'iseditable':
        await cmdIsEditable(positional[0]);
        break;
      case 'isdisabled':
        await cmdIsDisabled(positional[0]);
        break;
      case 'getattribute':
        await cmdGetAttribute(positional[0], positional[1]);
        break;
      case 'textcontent':
        await cmdTextContent(positional[0]);
        break;
      case 'innertext':
        await cmdInnerText(positional[0]);
        break;
      case 'innerhtml':
        await cmdInnerHTML(positional[0]);
        break;
      case 'inputvalue':
        await cmdInputValue(positional[0]);
        break;
      case 'boundingbox':
        await cmdBoundingBox(positional[0]);
        break;
      case 'count':
        await cmdCount(positional[0]);
        break;

      // Mouse
      case 'mousemove':
        await cmdMouseMove(parseFloat(positional[0]), parseFloat(positional[1]), flags);
        break;
      case 'mouseclick':
        await cmdMouseClick(parseFloat(positional[0]), parseFloat(positional[1]), flags);
        break;
      case 'mousedblclick':
        await cmdMouseDblClick(parseFloat(positional[0]), parseFloat(positional[1]), flags);
        break;
      case 'mousedown':
        await cmdMouseDown(flags);
        break;
      case 'mouseup':
        await cmdMouseUp(flags);
        break;
      case 'mousewheel':
        await cmdMouseWheel(parseFloat(positional[0]), parseFloat(positional[1]));
        break;

      // Keyboard
      case 'keypress':
        await cmdKeyPress(positional[0], flags);
        break;
      case 'keytype':
        await cmdKeyType(positional.join(' '), flags);
        break;
      case 'keydown':
        await cmdKeyDown(positional[0]);
        break;
      case 'keyup':
        await cmdKeyUp(positional[0]);
        break;
      case 'keyinserttext':
        await cmdKeyInsertText(positional.join(' '));
        break;

      // Pages
      case 'newpage':
        await cmdNewPage(positional[0]);
        break;
      case 'closepage':
        await cmdClosePage(positional[0]);
        break;
      case 'switchpage':
        await cmdSwitchPage(positional[0]);
        break;
      case 'listpages':
        await cmdListPages();
        break;
      case 'bringtofront':
        await cmdBringToFront();
        break;

      // Frames
      case 'frames':
        await cmdFrames();
        break;
      case 'framelocator':
        await cmdFrameLocator(positional[0]);
        break;

      // Cookies
      case 'getcookies':
        await cmdGetCookies(positional.length > 0 ? positional : undefined);
        break;
      case 'setcookie':
        await cmdSetCookie(JSON.parse(positional.join(' ')));
        break;
      case 'clearcookies':
        await cmdClearCookies();
        break;

      // Storage
      case 'localstorage':
        await cmdLocalStorage(positional[0] as any, positional[1], positional[2]);
        break;
      case 'sessionstorage':
        await cmdSessionStorage(positional[0] as any, positional[1], positional[2]);
        break;
      case 'storagestate':
        await cmdStorageState(positional[0]);
        break;

      // Network
      case 'route':
        await cmdRoute(positional[0], positional[1] as any, flags);
        break;
      case 'unroute':
        await cmdUnroute(positional[0]);
        break;
      case 'waitforresponse':
        await cmdWaitForResponse(positional[0], flags);
        break;
      case 'waitforrequest':
        await cmdWaitForRequest(positional[0], flags);
        break;
      case 'setextrahttpheaders':
        await cmdSetExtraHTTPHeaders(JSON.parse(positional.join(' ')));
        break;
      case 'setoffline':
        await cmdSetOffline(positional[0] === 'true');
        break;

      // Files
      case 'download':
        await cmdDownload(positional[0], positional[1]);
        break;
      case 'setdownloadpath':
        await cmdSetDownloadPath(positional[0]);
        break;
      case 'expectdownload':
        await cmdExpectDownload(positional[0], positional[1]);
        break;

      // Dialogs
      case 'handledialog':
        await cmdHandleDialog(positional[0] as any, positional[1]);
        break;
      case 'getdialogs':
        await cmdGetDialogs();
        break;

      // Emulation
      case 'viewport':
        await cmdViewport(parseInt(positional[0]), parseInt(positional[1]));
        break;
      case 'geolocation':
        await cmdGeolocation(parseFloat(positional[0]), parseFloat(positional[1]), parseFloat(positional[2]));
        break;
      case 'permissions':
        await cmdPermissions(positional[0].split(','), positional[1]);
        break;
      case 'colorscheme':
        await cmdColorScheme(positional[0] as any);
        break;
      case 'media':
        await cmdMedia(positional[0] as any);
        break;
      case 'reducedmotion':
        await cmdReducedMotion(positional[0] as any);
        break;
      case 'forcedcolors':
        await cmdForcedColors(positional[0] as any);
        break;
      case 'timezone':
        await cmdTimezone(positional[0]);
        break;
      case 'locale':
        await cmdLocale(positional[0]);
        break;
      case 'useragent':
        await cmdUserAgent(positional.join(' '));
        break;

      // Tracing
      case 'starttracing':
        await cmdStartTracing(flags);
        break;
      case 'stoptracing':
        await cmdStopTracing(positional[0]);
        break;

      // Console
      case 'getconsole':
        await cmdGetConsole(flags.clear);
        break;

      // Locators
      case 'locator':
        await cmdLocator(positional[0], positional[1], ...positional.slice(2));
        break;
      case 'getbyrole':
        await cmdGetByRole(positional[0], flags);
        break;
      case 'getbytext':
        await cmdGetByText(positional[0], flags);
        break;
      case 'getbylabel':
        await cmdGetByLabel(positional[0], flags);
        break;
      case 'getbyplaceholder':
        await cmdGetByPlaceholder(positional[0], flags);
        break;
      case 'getbytestid':
        await cmdGetByTestId(positional[0]);
        break;
      case 'getbyalttext':
        await cmdGetByAltText(positional[0], flags);
        break;
      case 'getbytitle':
        await cmdGetByTitle(positional[0], flags);
        break;

      // Assertions
      case 'expecttext':
        await cmdExpectText(positional[0], positional[1], flags);
        break;
      case 'expectvalue':
        await cmdExpectValue(positional[0], positional[1], flags);
        break;
      case 'expectattribute':
        await cmdExpectAttribute(positional[0], positional[1], positional[2], flags);
        break;

      // Accessibility
      case 'accessibilitysnapshot':
        await cmdAccessibilitySnapshot(flags);
        break;

      // Browser
      case 'launch':
        await cmdLaunch(positional[0], flags.headless);
        break;
      case 'close':
        await cmdClose();
        break;
      case 'contexts':
        await cmdContexts();
        break;
      case 'newcontext':
        await cmdNewContext(flags);
        break;
      case 'closecontext':
        await cmdCloseContext();
        break;
      case 'status':
        await cmdStatus();
        break;
      case 'help':
        cmdHelp();
        break;

      default:
        error(`Unknown command: ${command}. Run 'help' for available commands.`);
    }
  } catch (e: any) {
    error(e.message, { stack: e.stack });
  }
}

main();
