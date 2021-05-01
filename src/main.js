// rem 自动化适配
import "amfe-flexible/index.js"

// style
import "@/common/css/reset.css"
import "@/common/css/globe.less"
import "@/common/css/common.less"

import Vue from 'vue'
import App from './App.vue'

import Vant from 'vant';
import {Lazyload} from 'vant';
import 'vant/lib/index.css';


// 跨域
import axios from "axios";
import promiseHelper from "./mixins/promiseHelper";
import siteHelper from "./mixins/siteHelper";

import store from "./store"
import router from "./router"

// 兼容 IE
import "core-js/stable";
import "regenerator-runtime/runtime";

import waterfall from 'vue-waterfall2'


import VueScroller from 'vue-scroller'

Vue.component("Provide", () => import("./components/Provide"))

Vue.component("GoodsMore", () => import("./components/GoodsMore"))


// 禁止浏览器滑动事件;
document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault()
    },
    {
      passive: false
    }
);

// 阻止浏览器菜单的出现
document.oncontextmenu = function (e) {
  e.preventDefault();
};

Vue.use(Lazyload);
Vue.use(Vant);
Vue.mixin(siteHelper);
Vue.mixin(promiseHelper);
Vue.use(VueScroller)
Vue.use(waterfall)
Vue.prototype.$http = axios;
Vue.config.productionTip = false

new Vue({
    router,
    store,
  render: h => h(App),
}).$mount('#app')
