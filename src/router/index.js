import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "./modules/dashboard";
import Account from "./modules/account";
import Sort from "./modules/sort";
import ShoppingCart from "./modules/shoppingCart";
import Goods from "./modules/goods";
import Member from "./modules/member";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "hash",
	routes: [
		{
			name: "appHome",
			path: "/app",
			redirect: "/app/dashboard",
			component: () => import(`@/components/AppHome`),
			children: [
				...Dashboard,
				...Sort,
				...ShoppingCart,
				...Goods,
				...Member
			]
		},
		...Account,
		{path: "*", redirect: "/app/dashboard"}
	]
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalPush.call(this, location, onResolve, onReject);
	return originalPush.call(this, location).catch(err => err);
};

export default router;
