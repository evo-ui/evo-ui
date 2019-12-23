import { mapState, mapStateMutations } from './vuex-mapper';
import Vuex from 'vuex';


/**
 *
 * @type {{}}
 */
let actionsDefault = {};

/**
 *
 * @param context
 */
actionsDefault.stateStoreInStorage = function(context) {
    hx.storage('app', context.state);
};

/**
 *
 * @param context
 */
actionsDefault.stateLoadFromStorage = function(context) {
    let store = hx.storage('app');

    if(store && typeof store === 'object') {
        for(let i in store) {
            if(!store.hasOwnProperty(i)) {
                continue;
            }
            context.commit(i, store[i]);
        }
    }
};


let Store = {};

Store.make = function(state, actions) {

    if (actions) {
        actions = Object.assign(actionsDefault, actions);
    } else {
        actions = actionsDefault;
    }

    return new Vuex.Store({
        state,
        mutations: mapStateMutations(state),
        actions,
    });
};

Store.computed = mapState;
Store.methods = Vuex.mapActions;

// window.app.storeMapper = {
//     computed: mapState,
//     methods: Vuex.mapActions,
// };

export default Store;
