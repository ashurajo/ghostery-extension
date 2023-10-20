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

import { define, html, dispatch } from 'hybrids';

function openBlog() {
	chrome.tabs.create({
		url: 'https://www.ghostery.com/blog/whats-happening-with-youtube-ads',
	});
}

export default define({
	tag: 'youtube-message',
	content: ({ onclose }) => html`
    <template layout="block overflow">
      <ui-onboarding-card layout="padding:2">
        <div layout="row items:start gap:2">
          <div layout="relative">
            <ui-icon name="ghosty" color="gray-300" layout="size:4"></ui-icon>
            <ui-icon
              name="alert"
              color="error-500"
              layout="absolute bottom:-1 right:-1"
            ></ui-icon>
          </div>
          <div layout="column gap:1.5">
						<div layout="margin:bottom:-1 row">
							<ui-text type="label-l">
								YouTube blocking you from watching ad-free videos?
							</ui-text>
							<ui-action>
								<button
									id="close"
									onclick="${host => dispatch(host, 'close')}"
									layout="margin:-1 self:start shrink:0 padding"
								>
									<div layout="row center size:3">
										<ui-icon name="close" layout="size:2"></ui-icon>
									</div>
								</button>
							</ui-action>
						</div>
            <ui-text type="body-s">
              We know you rely on Ghostery for a smooth YouTube experience.
              Until a more refined solution emerges, here’s a temporary fix.
            </ui-text>
            <div layout="row:wrap gap">
              <ui-button type="success" size="small">
                <button onclick="${host => dispatch(host, 'open')}">Open YouTube in Private Window</button>
              </ui-button>
            </div>
            <div class="hr"></div>
            <ui-text type="label-s">
              Learn more about YouTube’s challenges to ad blockers
            </ui-text>
            <div layout="row:wrap gap">
              <ui-button type="outline" size="small">
                <button onclick="${openBlog}">Visit our blog</button>
              </ui-button>
            </div>
          </div>
        </div>
      </ui-onboarding-card>
    </template>
  `.css`
		.hr {
			background: #D4D6D9;
			height: 2px;
			align-self: stretch;
		}
	`,
});
