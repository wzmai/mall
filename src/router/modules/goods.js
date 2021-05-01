export default [
	{
		name: "goods",
		path: "goods",
		component: () => import(`@/modules/goods/views/GoodsLists`),
		meta: {
			title: "商品列表",
			childPage: true,
			keepAlive: true,
		}
	},
	{
		name: "goodsDetails",
		path: "goodsDetails",
		component: () => import(`@/modules/goods/views/GoodsDetails`),
		meta: {
			title: "商品详情",
			childPage: true,
			keepAlive: true,
		}
	},
];
