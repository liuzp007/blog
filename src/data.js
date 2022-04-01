export const Menu = [
    {
        name: 'React',
        path: '/react',
        comparison: [
            {
                name: 'react 原理',
                path: '/theory',
                list: [
                    {
                        name:'渲染原理',
                        path:'/rendering'
                    },
                    {
                        name:'diff 算法',
                        path:'/diff'
                    },
                    {
                        name:'setState',
                        path:'/setState'
                    },
                ]
            },
            {
                name: '类式',
                path: '/class',
                list: [
                    {
                        name:'componentWillMount',
                        path:'/willMount'
                    },
                    {
                        name:'render',
                        path:'/render'
                    },
                    
                    {
                        name:'componentDidMount',
                        path:'/didMount'
                    }
                ]
            },
            {
                name: '函数式',
                path: '/function',
                list:[
                    {
                        name:'useEffect',
                        path:'/useEffect'
                    }
                ]
            },
        ],
        children:[{
            name:'11111111111111',
            path:'/??'
        }]
       
    },
    {
        name: 'Vue',
        path: '/vue',
        comparison: [
            {
                name: 'vue x2',
                path: '/vuex2',
                list: [
                 
                ]
            },
            {
                name: 'vue x3',
                path: '/vuex3',
                list: [
                 
                ]
            },
            
 
        ]
    },
    {
        name: 'webpack',
        path: '/webpack'
    },
    {
        name: 'Git',
        path: '/git'
    }
]