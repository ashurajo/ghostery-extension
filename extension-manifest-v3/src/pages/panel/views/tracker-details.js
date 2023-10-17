/**
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2017-present Ghostery GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

import { html, router, store } from 'hybrids';

import TabStats from '/store/tab-stats.js';
import { openTabWithUrl } from '/utils/tabs.js';

function cleanUp(text) {
  return text.replace(/(\\"|\\n|\\t|\\r)/g, '').trim();
}

function showCopyNotification(host) {
  const wrapper = document.createDocumentFragment();

  Array.from(
    host.querySelectorAll('#gh-panel-company-alerts gh-panel-alert'),
  ).forEach((el) => el.parentNode.removeChild(el));

  html`
    <gh-panel-alert type="success" slide autoclose="2">
      Copied to clipboard
    </gh-panel-alert>
  `(wrapper);

  host.querySelector('#gh-panel-company-alerts').appendChild(wrapper);
}

export default {
  [router.connect]: { dialog: true },
  stats: store(TabStats),
  trackerId: '',
  tracker: ({ stats, trackerId }) =>
    stats.trackers.find((t) => t.id === trackerId),
  wtmUrl: ({ tracker }) =>
    tracker.category !== 'unidentified' &&
    `https://www.whotracks.me/trackers/${tracker.id}.html`,
  content: ({ tracker, wtmUrl }) => html`
    <template layout="column">
      <gh-panel-dialog>
        <div
          id="gh-panel-company-alerts"
          layout="absolute inset:1 bottom:auto"
        ></div>
        <ui-text slot="header" type="label-l">${tracker.name}</ui-text>

        ${tracker.company !== tracker.name &&
        html`
          <ui-text slot="header" type="body-s" color="gray-600">
            ${tracker.company}
          </ui-text>
        `}
        ${(tracker.description || wtmUrl) &&
        html`
          <div layout="column gap:0.5">
            ${tracker.description &&
            html`
              <ui-text type="body-s"> ${cleanUp(tracker.description)} </ui-text>
            `}
            ${wtmUrl &&
            html`
              <ui-text type="label-xs" color="primary-700" underline>
                <a href="${wtmUrl}" onclick="${openTabWithUrl}">
                  Read more on WhoTracks.Me
                </a>
              </ui-text>
            `}
          </div>
          <ui-line></ui-line>
        `}
        <section
          layout="
            grid:max|1 items:start:stretch content:start gap:1:2.5
            grow:1
            padding:bottom:4
          "
        >
          ${tracker.requestsObserved.length > 0 &&
          html`
            <ui-icon name="shield"></ui-icon>
            <div layout="column gap">
              <ui-text type="label-s">URLs observed</ui-text>
              <div layout="column gap:2">
                <div layout="column gap">
                  ${tracker.requestsObserved.map(
                    ({ url }) =>
                      html`
                        <gh-panel-copy oncopy="${showCopyNotification}">
                          ${url}
                        </gh-panel-copy>
                      `,
                  )}
                  ${tracker.requestsObserved.length >= 10 &&
                  html`<ui-text type="body-s" color="gray-600">...</ui-text>`}
                </div>
              </div>
            </div>
          `}
          ${tracker.requestsBlocked.length > 0 &&
          html`
            <ui-icon name="block"></ui-icon>
            <div layout="column gap">
              <ui-text type="label-s">URLs blocked</ui-text>
              <div layout="column gap:2">
                <div layout="column gap">
                  ${tracker.requestsBlocked.map(
                    ({ url }) =>
                      html`
                        <gh-panel-copy oncopy="${showCopyNotification}">
                          ${url}
                        </gh-panel-copy>
                      `,
                  )}
                  ${tracker.requestsBlocked.length >= 10 &&
                  html`<ui-text type="body-s" color="gray-600">...</ui-text>`}
                </div>
              </div>
            </div>
          `}
          ${tracker.requestsModified.length > 0 &&
          html`
            <ui-icon name="eye"></ui-icon>
            <div layout="column gap">
              <ui-text type="label-s">URLs modified</ui-text>
              <div layout="column gap:2">
                <div layout="column gap">
                  ${tracker.requestsModified.map(
                    ({ url }) =>
                      html`
                        <gh-panel-copy oncopy="${showCopyNotification}">
                          ${url}
                        </gh-panel-copy>
                      `,
                  )}
                  ${tracker.requestsModified.length >= 10 &&
                  html`<ui-text type="body-s" color="gray-600">...</ui-text>`}
                </div>
              </div>
            </div>
          `}
          ${tracker.website &&
          html`
            <ui-icon name="globe"></ui-icon>
            <div layout="column gap">
              <ui-text type="label-s">Website</ui-text>
              <ui-text
                type="body-s"
                color="primary-700"
                ellipsis
                underline
                layout="padding margin:-1"
              >
                <a href="${tracker.website}" onclick="${openTabWithUrl}">
                  ${tracker.website}
                </a>
              </ui-text>
            </div>
          `}
          ${tracker.privacyPolicy &&
          html`
            <ui-icon name="privacy"></ui-icon>
            <div layout="column gap">
              <ui-text type="label-s">
                <!-- | Panel Company -->Privacy policy
              </ui-text>
              <ui-text
                type="body-s"
                color="primary-700"
                ellipsis
                underline
                layout="padding margin:-1"
              >
                <a href="${tracker.privacyPolicy}" onclick="${openTabWithUrl}">
                  ${tracker.privacyPolicy}
                </a>
              </ui-text>
            </div>
          `}
          ${tracker.contact &&
          html`
            <ui-icon name="mail"></ui-icon>
            <div layout="column gap">
              <ui-text type="label-s">Contact</ui-text>
              <ui-text
                type="body-s"
                color="primary-700"
                ellipsis
                underline
                layout="padding margin:-1"
              >
                <a
                  href="${tracker.contact.startsWith('http')
                    ? ''
                    : 'mailto:'}${tracker.contact}"
                  onclick="${openTabWithUrl}"
                >
                  ${tracker.contact}
                </a>
              </ui-text>
            </div>
          `}
        </section>
      </gh-panel-dialog>
    </template>
  `,
};
