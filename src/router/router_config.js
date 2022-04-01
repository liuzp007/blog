import LoadableComponent from '../utils/LoadableComponent';
import NotFound from '../components/notFound'

let moduleFile = require.context('../pages', true, /index.(js|jsx)$/);
let result = moduleFile.keys().reduce((prev, item) => {
    let str = item.split('/')[item.split('/').length - 2];
    let name = str[0].toLocaleUpperCase() + str.slice(1);
    prev = Object.assign({}, prev, {
        [name]: LoadableComponent(import('../pages' + item.slice(1))),
    });
    return prev;
}, {});
console.log(result)
let router_config = [{
    name: 'home',
    path: '/',
    component: result.Home,
    exact:true
},
{
    name:'main',
    path:'/main',
    component:result.Main,
    children:[
        {
            name:'render',
            path:'/main/render',
            component:result.Render,
        },
        {
            name:'render',
            path:'/main/rendering',
            component:result.Rendering,
        },
        {
            name:'diff',
            path:'/main/diff',
            component:result.Diff,
        },
        {
            name:'setState',
            path:'/main/setState',
            component:result.SetState,
        },
        {
            name:'didMount and willUnMount',
            path:'/main/didMount',
            component:result.DidMount,
        },
        {
            name:'componentWillMount',
            path:'/main/willMount',
            component:result.WillMount
        },
        {
            name:'useEffect',
            path:'/main/useEffect',
            component:result.UseEffect
        },
    ]
},

// {
//     name:'main',
//     path:'/main/*',
//     redirect:'/404'
// },
{
    name:404,
    path:'/404',
    component:NotFound
},
{
    name:'404',
    path:'/*',
    redirect:'/404'
}
];
export default router_config;
