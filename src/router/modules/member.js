export default [
	{
		name: "member",
		path: "member",
		component: () => import(`@/modules/member/views/Member`),
		meta: {
			title: "我的",
			keepAlive: true,
		}
	},

	{
		name: "orders",
		path: "orders",
		component: () => import(`@/modules/member/views/Orders`),
		meta: {
			title: "我的订单",
			childPage: true,
			keepAlive: true,
		}
	},

	{
		name: "address",
		path: "address",
		component: () => import(`@/modules/member/views/Address`),
		meta: {
			title: "收货地址",
			childPage: true,
			keepAlive: true,
		}
	},


	{
		name: "addAddress",
		path: "addAddress",
		component: () => import(`@/modules/member/views/AddAddress`),
		meta: {
			title: "新增收货地址",
			childPage: true,
			keepAlive: true,
		}
	},



];
