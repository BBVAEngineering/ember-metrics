import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	metrics: service(),

	setupController(controller) {
		this.metrics.trackEvent({ controller });
	}
});
