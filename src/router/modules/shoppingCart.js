export default [
	{
		name: "shoppingCart",
		path: "shoppingCart",
		component: () => import(`@/modules/shoppingCart/views/ShoppingCart`),
		meta: {
			title: "购物车",
			keepAlive: true,
		}
	},

	{
		name: "confirmOrder",
		path: "confirmOrder",
		component: () => import(`@/modules/shoppingCart/views/ConfirmOrder`),
		meta: {
			title: "确认订单",
			childPage: true,
			keepAlive: true,
		}
	},
];
