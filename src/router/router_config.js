import LoadableComponent from '../utils/LoadableComponent';
import NotFound from '../components/notFound';
import data  from '../data';
let moduleFile = require.context('../pages', true, /index.(js|jsx)$/);
let result = moduleFile.keys().reduce((prev, item) => {
    let str = item.split('/')[item.split('/').length - 2];
    let name = str[0].toLocaleUpperCase() + str.slice(1);
    prev = Object.assign({}, prev, {
        [name]: LoadableComponent(import('../pages' + item.slice(1))),
    });
    return prev;
}, {});

let Component = new Array()
data?.forEach((item)=>{
    if(item.comparison?.length > 0){
        const {comparison} = item
        comparison.forEach((element)=>{
            element.list?.forEach((i)=>{
                let  {name,path} = i
                path = path[1].toLocaleUpperCase() + path.slice(2)
                Component.push({
                    name,
                    path:`/main/${path}`,
                    component:result[path]
                })
            })
        })
    }
})

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
        // {
        //     name:'render',
        //     path:'/main/render',
        //     component:result.Render,
        // },
        // {
        //     name:'render',
        //     path:'/main/rendering',
        //     component:result.Rendering,
        // },
        // {
        //     name:'diff',
        //     path:'/main/diff',
        //     component:result.Diff,
        // },
        // {
        //     name:'setState',
        //     path:'/main/setState',
        //     component:result.SetState,
        // },
        // {
        //     name:'didMount and willUnMount',
        //     path:'/main/didMount',
        //     component:result.DidMount,
        // },
        // {
        //     name:'componentWillMount',
        //     path:'/main/willMount',
        //     component:result.WillMount
        // },
        // {
        //     name:'useEffect',
        //     path:'/main/useEffect',
        //     component:result.UseEffect
        // },
        // {
        //     name:'useMomo',
        //     path:'/main/useMomo',
        //     component:result.UseMomo
        // },
        ...Component
    ]
},

// {
//     name:'main',
//     path:'/main/*',
//     redirect:'/404'
// },
{
    name:'简历',
    path:'/resume',
    component:result.Resume
},
{
    name:'简历',
    path:'/standard',
    component:result.Standard
},

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
