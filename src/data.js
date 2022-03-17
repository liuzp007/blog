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
                    }
                ]
            },
            {
                name: '类式',
                path: '/class',
                list: [
                    {
                        name:'render',
                        path:'/render'
                    }
                ]
            },
            {
                name: '函数式',
                path: '/function',
                list:[
                    {
                        name:'useState',
                        path:'/useState'
                    }
                ]
            },
        ]
       
    },
    {
        name: 'Vue',
        path: '/vue',
        children: [
            {
                name: 'Vue-1',
                path: '/vue-1'
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