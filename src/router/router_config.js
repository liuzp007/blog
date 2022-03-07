import LoadableComponent from '../utils/LoadableComponent';
let moduleFile = require.context('../pages', true, /index.(js|jsx)$/);
let result = moduleFile.keys().reduce((prev, item) => {
    let str = item.split('/')[item.split('/').length - 2];
    let name = str[0].toLocaleUpperCase() + str.slice(1);
    prev = Object.assign({}, prev, {
        [name]: LoadableComponent(import('../pages' + item.slice(1))),
    });
    return prev;
}, {});
let router_config = [{
    name: 'home',
    path: '/',
    component: result.Home,
    exact:true
},
{
    name:'main',
    path:'/main',
    component:result.Main
}
];
export default router_config;
