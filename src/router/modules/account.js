export default [
  {
    name: "login",
    path: "/login",
    component: () => import(`@/modules/account/views/Login`),
    meta: {
      title: "登录",
      keepAlive: true,
    }
  },

  {
    name: "register",
    path: "/register",
    component: () => import(`@/modules/account/views/Register`),
    meta: {
      title: "注册",
      keepAlive: true,
    }
  },
];
