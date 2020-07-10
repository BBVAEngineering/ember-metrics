/* eslint-disable no-magic-numbers */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('piwik adapter', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		sandbox = sinon.createSandbox();
		config = {
			piwikUrl: '/assets',
			siteId: 42
		};
	});

	hooks.afterEach(() => {
		sandbox.restore();
	});

	test('#identify calls piwik with the right arguments', function(assert) {
		const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:piwik').create({ config });
		const stub = sandbox.stub(window._paq, 'push').callsFake(() => true);

		adapter.identify({
			userId: 123
		});
		assert.ok(stub.calledWith(['setUserId', 123]), 'it sends the correct arguments');
	});

	test('#trackEvent calls piwik with the right arguments', function(assert) {
		const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:piwik').create({ config });
		const stub = sandbox.stub(window._paq, 'push').callsFake(() => true);

		adapter.trackEvent({
			category: 'button',
			action: 'click',
			name: 'nav buttons',
			value: 4
		});

		assert.ok(stub.calledWith(['trackEvent', 'button', 'click', 'nav buttons', 4]), 'it sends the correct arguments');
	});

	test('#trackPage calls piwik with the right arguments', function(assert) {
		const adapter = this.owner.factoryFor('ember-metrics@metrics-adapter:piwik').create({ config });
		const stub = sandbox.stub(window._paq, 'push').callsFake(() => true);

		adapter.trackPage({
			page: '/my-overridden-page?id=1',
			title: 'my overridden page'
		});
		assert.ok(stub.calledWith(['setCustomUrl', '/my-overridden-page?id=1']), 'it sends the correct arguments');
		assert.ok(stub.calledWith(['trackPageView', 'my overridden page']), 'it sends the correct arguments');
	});
});
