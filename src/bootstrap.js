import Vue from 'vue'
import VueRouter from 'vue-router'
import Helper from './lib/helper';
import Mixin from './lib/mixin';
import Store from './lib/store';
import Bootstrap from './bootstrap';
import dayJS from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

import debounce from 'lodash/debounce'
import sortBy from 'lodash/sortBy'
import clone from 'lodash/clone'
import isArray from 'lodash/isArray'

/**
 * Expose some lodash functions
 * @type {{debounce: *, clone: *, sortBy: *, isArray: *}}
 * @private
 */
window._ = {
    debounce,
    sortBy,
    clone,
    isArray,
};

/**
 * Expose DayJS lib for datetime manipulation
 */
dayJS.extend(relativeTime);
window.dayJs = dayJS;

/**
 * Setup Vue configs and extend prototype
 * @type {boolean}
 */
Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueRouter);
Vue.mixin(Mixin);

Vue.prototype.$http = Helper.xhr;

/**
 * Add computed/methods for global store states to helper
 */
Helper.computed = Store.computed;
Helper.methods = Store.methods;

/**
 * Expose Vue and helpers to window instance
 */
window.Vue = Vue;
window.VueRouter = VueRouter;
window.hx = Helper;

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
    if (routes) {
        router = new VueRouter({
            mode: mode || 'history',
            routes,
            scrollBehavior
        });
    }

    let store = null;
    if (states || actions) {
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

