# Artemis article chat

`ArtemisChat` is a client-only MDX component used only by
`blogposts/how-i-built-artemis-agentforce-demo.mdx`. It uses Salesforce's default
floating launcher. The component is disabled unless
`NEXT_PUBLIC_ARTEMIS_CHAT_ENABLED=true` is present **at build time**.

The public deployment values come from the existing Artemis Salesforce metadata,
not invented identifiers. On October 20, 2026 the public configuration endpoint
confirmed `Artemis_Web_Chat` and the exact helper site URL in the component.
No credentials or user-verification tokens belong in this component.

## Navigation

The deployed Enhanced Chat v2 bootstrap does **not** implement
`utilAPI.removeAllComponents`, despite that method appearing in the general API
reference. `clearSession` clears data in all tabs/windows, even with its default
argument, so it must not be used for navigation cleanup.

After entering the article, leaving it deliberately loads a new document.
Ordinary links, Next router navigation, and browser Back/Forward are covered.
Same-article hash/query changes stay in place. Modified clicks and new-tab links
retain their usual behavior. Unloading releases SDK listeners, frames, timers and
scroll locks without ending the shared conversation. Returning loads one fresh
SDK instance; Salesforce manages session continuity. No SDK is loaded on a fresh
visit to another page. This is a deliberate compatibility tradeoff, not fully
client-side chat teardown.

## Origin configuration and release

Initial testing found both CORS and `frame-ancestors` denials. On October 20,
2026, Dusty explicitly approved adding these exact origins to both allowlists:

- `https://dustygalindo.net`
- `http://localhost:3000`

The existing CLI authorization was used to inspect and update the verified
Artemis org (`00DgK00000b0lxiUAA`). Four records were added: two
`CorsWhitelistEntry` rows and two `SiteIframeWhiteListUrl` rows. No existing rows
were edited or removed. The iframe entries belong only to backing Site
`0DMgK00000224RNWAY`, named `ESW_Artemis_Web_Chat_1790750116762`.
Its corresponding Experience Cloud record has a trailing `1` in its name and ID
`0DMgK00000224ROWAY`; the existing iframe policy is owned by the backing Site.

Fresh queries verified all three original entries in each list were preserved,
and both Site records' protection values were unchanged. Public configuration
responses now return an exact matching `Access-Control-Allow-Origin` for each
approved origin. Both the chat and file-preview responses include the two exact
origins in `frame-ancestors`. No wildcard, global iframe setting, clickjack level,
agent configuration, or credential was changed.

For a release, set the build-time flag in the existing deployment environment, run
`npm run build`, and use the website's existing App Engine release workflow.
Deploy only with the owner's approval. Preserve the existing runtime and build
environment values; add `NEXT_PUBLIC_ARTEMIS_CHAT_ENABLED=true` under
`build_env_variables` in the existing App Engine configuration (and keep its
runtime counterpart consistent). Upload a new version without promoting it,
retain the previous serving version for rollback, check the uploaded version,
and then move traffic. Verify the actual production article and other routes.
Any additional Salesforce security changes require separate approval. Do not
deploy the isolated local test build or its placeholder API values.

## Local verification

Use a non-production environment, build with the flag enabled, and start the app
on `http://localhost:3000`. With Playwright installed, run:

```sh
node tests/artemis-chat.mjs
```

If using an existing external Playwright installation, set `PLAYWRIGHT_MODULE`
to its absolute `index.mjs` path. `CHAT_TEST_BASE_URL` overrides the localhost URL.
The test uses a **mock SDK**, including Salesforce's Proxy behavior, to exercise
article scope, refresh, SPA entry, document departure, Back/Forward, programmatic
navigation, another MDX article, loading failures/races, cross-tab preservation,
and a 390px mobile viewport. It does not establish live Salesforce chat success.

The final local production build passed lint/type checks and static generation
with existing unrelated warnings. All 13 mocked browser scenarios passed again
after the org ID correction below. The lifecycle was also checked in development
StrictMode. With the flag omitted, a separate check confirmed zero Salesforce
requests and ordinary client navigation.

### Diagnosed and corrected event-stream failure

After the approved origin additions, the SDK loaded but initially showed
"Reconnecting...". The existing Experience Cloud demo answered normally when
tested at the same time, ruling out an unavailable agent backend.

The local embed successfully fetched configuration and an anonymous access token
and created a conversation, but `/eventrouter/v1/sse` and `/eventrouter/v1/poll`
returned HTTP 400. The error body identified the exact mismatch:

```text
OrgId in the header and token must match, but got '00DgK00000b0lxiUAA'
in the header and '00DgK00000b0lxi' in the token
```

The component now initializes with the verified **15-character**
`00DgK00000b0lxi`, rather than its equivalent 18-character CLI representation.
This is the same org; no deployment, channel, credentials, or security settings
were changed for this fix.

The test also waits for Artemis's greeting before sending a message. Sending
immediately when the text box first appears can race conversation creation in
the native demo too, producing `conversation/undefined/message` and HTTP 401.
`onEmbeddedMessagingReady` means the SDK APIs are ready, not that a newly opened
conversation has completed connecting.

### Final real-service checks

With the corrected org ID, the local article returned an actual Artemis answer
to the harmless Orion question, with no Salesforce API failures recorded.
Verified against the real SDK:

- Fresh blog index makes no Salesforce bootstrap request.
- Exactly one SDK root; the conversation survives a hard refresh.
- Leaving with chat open unloads the SDK and removes chat from the index.
- Another article tab retains the conversation.
- Browser Back restores one chat with history; Forward removes it again.
- At a 390px viewport, the full-screen conversation is readable and usable;
  minimizing it and leaving the article removes chat.

The Mac was locked during the settings work; existing CLI authorization provided
the verified alternative. No new security changes were needed after diagnosing
the org ID mismatch. Builds remain disabled by default unless the release flag is
explicitly set. Production-domain end-to-end verification must follow a release;
the local result does not substitute for checking the deployed origin.

## Primary references

- https://developer.salesforce.com/docs/ai/agentforce/guide/enhanced-chat-inline-mode.html
- https://developer.salesforce.com/docs/service/messaging-web/references/m4w-reference/utilAPI.html
- https://developer.salesforce.com/docs/service/messaging-web/references/m4w-reference/userVerificationAPI.html
- https://developer.salesforce.com/docs/service/messaging-web/guide/event-listeners.html
- https://help.salesforce.com/s/articleView?id=service.miaw_configure_web_deployment_1.htm&language=en_US&type=5
- https://orgfarm-3b88d4b07c-dev-ed.develop.my.site.com/ESWArtemisWebChat1790750116762/assets/js/bootstrap.js
