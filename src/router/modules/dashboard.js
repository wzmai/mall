export default [
  {
    name: "dashboard",
    path: "dashboard",
    component: () => import(`@/modules/dashboard/views/Dashboard`),
    meta: {
      title: "首页",
      keepAlive: true,
    }
  },
];
