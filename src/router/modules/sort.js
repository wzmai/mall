export default [
	{
		name: "sort",
		path: "sort",
		component: () => import(`@/modules/sort/views/Sort.vue`),
		meta: {
			title: "分类",
			keepAlive: true,
		}
	},
];
