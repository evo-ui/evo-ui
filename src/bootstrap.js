/**
 * Create bootstrap instance and expose it
 * @type {{}}
 */
let Bootstrap = {};

/**
 * Make a new Vue instance with routes and states
 * @param routes
 * @param states
 * @returns {Vue | CombinedVueInstance<Vue, object, object, object, Record<never, any>>}
 */
Bootstrap.make = function({routes, components, states, scrollBehavior, actions, mode}) {
    let router = null;
    if (routes && typeof VueRouter !== 'undefined') {
        let router = new VueRouter({
            mode: mode || 'history',
            routes,
            scrollBehavior
        });
    }

    let store = null;
    if (typeof Store !== 'undefined' && (states || actions)) {
        store = states ? Store.make(states, actions) : null;
    }

    /**
     * Initialize and mount application
     */
    return new Vue({
        store,
        computed: states ? hx.computed(Object.keys(states)) : {},
        components,
        router
    });
};

export default Bootstrap;

