import LoadableComponent from "../utils/LoadableComponent";
import NotFound from "../components/notFound";
import data from "../data";
let moduleFile = require.context("../pages", true, /index.(js|jsx)$/);
let result = moduleFile.keys().reduce((prev, item) => {
  let str = item.split("/")[item.split("/").length - 2];
  let name = str[0].toLocaleUpperCase() + str.slice(1);
  prev = Object.assign({}, prev, {
    [name]: LoadableComponent(import("../pages" + item.slice(1))),
  });
  return prev;
}, {});

const Component = [];

data?.forEach((item) => {
  const { comparison, children } = item;
  const menuList = comparison?.length ? comparison : children;
  menuList?.forEach((element) => {
    const list = element.list || [element];
    list.forEach((i) => {
      const { name, path } = i;
      const componentName = path[1].toUpperCase() + path.slice(2);
      Component.push({
        name,
        path: `/main/${componentName}`,
        component: result[componentName],
        switch: "switch",
      });
    });
  });
});

let router_config = [
  {
    name: "home",
    path: "/",
    component: result.Home,
    exact: true,
  },
  {
    name:'home',
    path:'/home',
    component:result.Home
  },
  {
    name: "main",
    path: "/main",
    component: result.Main,
    children: [...Component],
  },
  {
    name: "main",
    path: "/main/*",
    redirect: "/404",
  },
  {
    name: "简历",
    path: "/resume",
    component: result.Resume,
  },
  {
    name: "规范",
    path: "/standard",
    component: result.Standard,
  },
  {
    name:'足迹',
    path:'/footmark',
    component:result.Footmark
  },
  {
    name: 404,
    path: "/404",
    component: NotFound,
  },
  {
    name: "404",
    path: "/*",
    redirect: "/404",
  },
  {
    name: "404",
    path: "/main/*",
    redirect: "/404",
  },
];
export default router_config;
