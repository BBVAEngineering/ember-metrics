import removeFromDOM from '../../../utils/remove-from-dom';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, removeSpy;

module('Unit | Utility | remove-from-dom', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(document, 'querySelectorAll').returns([{
			parentElement: {
				removeChild: (removeSpy = sinon.spy())
			}
		}]);
	});

	hooks.afterEach(() => {
		sandbox.restore();
	});

	test('calls querySelectorAll with selector passed', (assert) => {
		const selector = 'script[data-fb-script]';

		removeFromDOM(selector);
		assert.ok(document.querySelectorAll.calledWith(selector));
	});

	test('calls removeChild for each element returned from the query', (assert) => {
		const selector = 'script[data-fb-script]';

		removeFromDOM(selector);
		assert.equal(removeSpy.callCount, 1);
	});
});
