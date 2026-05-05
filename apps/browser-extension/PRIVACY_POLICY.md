# Gauntlet — Privacy Policy

_Last updated: 2026-05-05_

This Privacy Policy describes how the **Gauntlet** browser extension (the
"Extension") handles data when you use it on Google Chrome, Microsoft Edge,
or any other Chromium-based browser.

The Extension is published by **[YOUR LEGAL NAME OR COMPANY]** ("we", "us"),
contactable at **[YOUR CONTACT EMAIL]**.

## 1. Summary

- The Extension is a "cursor capsule" — you press a hotkey, the Extension
  reads the page you are on, sends what you ask to our backend, and shows
  you the response.
- The Extension does **not** sell your data.
- The Extension does **not** track your browsing history.
- The Extension does **not** display ads.
- The Extension only sends data to our own backend at
  `https://ruberra-backend-jkpf-production.up.railway.app`.

## 2. What the Extension accesses

The Extension requests the following Chrome / Edge permissions:

| Permission        | Why it is requested                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `activeTab`       | Read the URL, title, and DOM of the tab you are on **only when you summon the capsule**.                         |
| `tabs`            | Locate the active tab in your current window so the capsule can be opened on it.                                  |
| `scripting`       | Inject the in-page capsule UI into the active tab when you press the hotkey.                                     |
| `storage`         | Save your local preferences (e.g. capsule position, dismissed domains) on your device only.                       |
| `<all_urls>`      | Allow the capsule to be summoned on any website you choose. The content script does **not** run until you summon.|

The Extension does **not** read pages in the background. The content script
on every page is dormant and only activates when **you** press the hotkey
(`Ctrl+Shift+Space` / `Cmd+Shift+Space`) or click the toolbar icon.

## 3. What data is sent to our backend

When you summon the capsule and submit a request, the following may be
sent to our backend at
`https://ruberra-backend-jkpf-production.up.railway.app`:

- The text you typed into the capsule.
- The URL and title of the active tab.
- The text you have selected on the page (if any).
- A simplified representation of the page DOM (text content, link
  structure) so the assistant can understand the page context.
- Optional: a screenshot of the visible portion of the page, **only when
  you explicitly request it** in the capsule.

We do **not** collect or transmit:

- Form values you have not selected or sent.
- Cookies, passwords, or session tokens.
- Files from your computer.
- Webcam, microphone, or location data.

## 4. How we use the data

We use the data **only** to:

1. Generate the assistant response shown back to you in the capsule.
2. Operate, debug, and improve the service (anonymized request-level
   logs with PII redaction).

We do not sell, rent, share, or transfer your data to third parties for
their own purposes. We do not use your data for advertising. We do not
build user profiles for targeting.

## 5. AI model providers

To produce responses we forward your request to AI model providers we
select for quality and cost (currently Google and Groq). Their handling
of the data is governed by their own policies:

- Google AI Studio / Gemini: <https://policies.google.com/privacy>
- Groq: <https://groq.com/privacy-policy/>

We send only the request payload described in section 3. We do not send
your account email or any other identifier to these providers.

## 6. Data retention

- **Local device data** (preferences in `chrome.storage`) stays on your
  device until you uninstall the Extension or clear extension storage.
- **Backend logs** are retained for up to **30 days** for debugging and
  abuse prevention, then purged.

## 7. Children

The Extension is not directed to children under 13. We do not knowingly
collect data from children under 13.

## 8. Your rights

You can:

- Stop all data collection at any time by uninstalling the Extension.
- Request deletion of any backend logs associated with your usage by
  emailing **[YOUR CONTACT EMAIL]**.
- Disable the Extension on a specific site using the per-domain dismiss
  control in the capsule.

## 9. Security

Traffic between the Extension and our backend is encrypted with TLS
(HTTPS). Our backend runs on Railway with standard cloud-provider
hardening. We do not guarantee absolute security; no internet service
can.

## 10. Changes to this policy

We may update this policy. The "Last updated" date at the top will
reflect any change. Material changes will be announced in the Extension
release notes.

## 11. Contact

Questions, complaints, or deletion requests:
**[YOUR CONTACT EMAIL]**
