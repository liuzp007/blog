export const Menu = [
    {
        name: 'React',
        path: '/react',
        comparison: [
            {
                name: 'react 原理',
                path: '/react',
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
                path: '/react',
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
                    },
                    {
                        name:'Memo',
                        path:'/memo'
                    }
                ]
            },
            {
                name: '函数式',
                path: '/react',
                list:[
                    {
                        name:'useEffect',
                        path:'/useEffect'
                    },
                    {
                        name:'useMemo',
                        path:'/useMemo'
                    },
                    {
                        name:'useCallback',
                        path:'/useCallback'
                    },
                    {
                        name:'useReducer',
                        path:'/useReducer'
                    },
                    {
                        name:'useRef',
                        path:'/useRef'
                    },
                    {
                        name:'useImperativeHandle',
                        path:'/useImperativeHandle'
                    },
                    {
                        name:'useLayoutEffect',
                        path:'/useLayoutEffect'
                    },
                    {
                        name:'自定义hooks',
                        path:'/customHooks'
                    }
                ]
            },
        ],

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
        path: '/webpack',
        children:[
            {
                name:'起源',
                path:'/webpack'
            }
        ]
    },
    {
        name: 'Git',
        path: '/git'
    }
]
export default Menu