import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const articlePath = '/blog/how-i-built-artemis-agentforce-demo';
const demoUrl = 'https://orgfarm-3b88d4b07c-dev-ed.develop.my.site.com/artemis/';
// Public deployment values verified against the existing Artemis metadata and
// Salesforce's public embedded-service-config response. These are not secrets.
const siteUrl = 'https://orgfarm-3b88d4b07c-dev-ed.develop.my.site.com/ESWArtemisWebChat1790750116762';
const scrt2URL = 'https://orgfarm-3b88d4b07c-dev-ed.develop.my.salesforce-scrt.com';
const scriptId = 'artemis-chat-bootstrap';
let bootstrapPromise;
let initialized = false;
let departing = false;

function isArticle(url) {
  const target = new URL(url, window.location.href);
  return target.origin === window.location.origin &&
    target.pathname.replace(/\/$/, '') === articlePath;
}

function loadBootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `${siteUrl}/assets/js/bootstrap.min.js`;
      script.async = true;
      // Do not resolve with Salesforce's Proxy object: Promise assimilation
      // probes its unsupported `then` property before the SDK is initialized.
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Artemis chat'));
      document.body.appendChild(script);
    });
  }
  return bootstrapPromise;
}

export default function ArtemisChat() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Deliberately opt-in; enable at build time for the approved website release.
    if (process.env.NEXT_PUBLIC_ARTEMIS_CHAT_ENABLED !== 'true' ||
        !isArticle(window.location.href)) return;

    let active = true;
    let readyTimer;
    const onReady = () => {
      window.clearTimeout(readyTimer);
      if (active) setFailed(false);
    };
    window.addEventListener('onEmbeddedMessagingReady', onReady);

    // The deployed WebV2 bootstrap doesn't implement removeAllComponents.
    // clearSession affects ALL tabs, so never use it for route cleanup.
    // Unload this document on departure instead of reinitializing the SDK in an
    // SPA. Keep same-article hash/query navigation and modified clicks native.
    const leave = (url) => {
      if (isArticle(url)) return;
      departing = true;
      // Suppress late SDK rendering while a programmatic Next route finishes
      // and the replacement document loads. These are the deployed v2 roots.
      const style = document.createElement('style');
      style.textContent = '#embedded-messaging, #embeddedMessagingFilePreviewFrame { display: none !important; }';
      document.head.appendChild(style);
      window.location.assign(url);
    };
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.hasAttribute('download') ||
          (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href);
      if (!['http:', 'https:'].includes(url.protocol) || isArticle(url.href)) return;
      event.preventDefault();
      event.stopPropagation();
      leave(url.href);
    };
    document.addEventListener('click', onClick, true);
    router.events.on('routeChangeStart', leave);
    router.beforePopState(({ as }) => {
      if (isArticle(as)) return true;
      // popstate has already moved the history entry; assign reloads that entry.
      leave(as);
      return false;
    });

    loadBootstrap().then(() => {
      if (!active || departing || !isArticle(window.location.href) || initialized) return;
      initialized = true; // Covers StrictMode's effect replay and MDX rerenders.
      readyTimer = window.setTimeout(() => active && setFailed(true), 20000);
      const bootstrap = window.embeddedservice_bootstrap;
      bootstrap.settings.language = 'en_US';
      // Default target (body) and default display mode produce the floating FAB.
      // Event Router requires the 15-character org ID to match its issued token.
      // The 18-character CLI ID works for config/auth but yields HTTP 400 for SSE.
      bootstrap.init('00DgK00000b0lxi', 'Artemis_Web_Chat', siteUrl, { scrt2URL });
    }).catch(() => {
      if (active) setFailed(true);
    });

    return () => {
      active = false;
      window.clearTimeout(readyTimer);
      window.removeEventListener('onEmbeddedMessagingReady', onReady);
      document.removeEventListener('click', onClick, true);
      router.events.off('routeChangeStart', leave);
      router.beforePopState(() => true);
    };
  }, [router]);

  return failed ? (
    <p role="status">
      Chat couldn&apos;t load here. You can still <a href={demoUrl}>try the Artemis demo</a>.
    </p>
  ) : null;
}
