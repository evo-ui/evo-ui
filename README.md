# [WIP] Evo UI Toolkit (Experimental)

Please ignore for now.

```js
import { Bootstrap } from 'evo-ui';

import App from './components/App';
import Home from './components/Page/Home';
import Status from "./components/Page/Status";
import Legal from "./components/Page/Legal";
import NotFound from './components/Page/NotFound';
import Mixin from "./Mixin";

let base = window.app.domain_base;

const routes = [
    { path: base, name: 'home', component: Home },
    { path: base + 'cart', name: 'cart', component: Cart },
    { path: base + 'status', name: 'status', component: Status },
    { path: base + 'legal/:type', name: 'legal', component: Legal },
    { path: '*', name: 'notfound', component: NotFound },
];

const components = {
    App
};

const states = {
    theme: 'light',
    dim: false,
    cart: []
};

Vue.mixin(Mixin);

let scrollBehavior = function (to, from, savedPosition) {
    return { x: 0, y: 0 };
};

let actions = {};

Bootstrap.make({
    routes,
    components,
    states,
    scrollBehavior,
    actions,
}).$mount('#app-wrapper');

```
