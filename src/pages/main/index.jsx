import React, { useEffect, useState, Component } from 'react'
import { getMenu } from "../../api/serve";
import { Menu, Layout } from "antd";
import RouterView from '../../router/router_view'
import Header from '../../components/header';
import {withRouter} from 'react-router-dom'
import './index.scss'
const { SubMenu } = Menu;
const { Sider, Content } = Layout;
function game() {
  let time = new Date()
  console.log("/**")
  console.log("*")
  console.log("*           _.._        ,------------.")
  console.log("*        ,'      `.    ( 你 瞅   啥!  )")
  console.log("*       /  __) __` \    `-,----------'")
  console.log("*      (  (`-`(-')  ) _.-'")
  console.log("*      /)  \  = /  (")
  console.log("*     /'    |--' .  \"")
  console.log("*    (  ,---|  `-.)__`")
  console.log("*     )(  `-.,--'   _`-.")
  console.log("*    '/,'          (  Uu",)
  console.log("*     (_       ,    `/,-' )")
  console.log("*     `.__,  : `-'/  /`--'")
  console.log("*       |     `--'  |")
  console.log("*       `   `-._   /")
  console.log("*        \        (")
  console.log("*        /\ .      \.  ")
  console.log("*       / |` \     ,-\"")
  console.log("*      /  \| .)   /   \"")
  console.log("*     ( ,'|\    ,'     :")
  console.log("*     | \,`.`--'/      }")
  console.log("*     `,'    \  |,'    /")
  console.log("*    / '-._   `-/      |")
  console.log("*    '-.   '-.,'|     ;")
  console.log("*   /        _/['---''']")
  console.log("*  :        /  |'-     '")
  console.log("*  '           |      /")
  console.log("*              `      |")
  console.log("*/")
  console.log("time:", time.toLocaleDateString())

}
class  ScrollToTop extends Component {
  componentDidUpdate(prevProps) { //跳转路由回到顶部
    if (this.props.location.pathname !== prevProps.location.pathname) {
      let divBox =  document.getElementById('contentID')
      divBox.scrollTo(0, 0)
    }
  }
  render() {
    return this.props.children
  }
}
let ScrollToTops =  withRouter(ScrollToTop);

export default function Main(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    game()
    getMenu().then((res) => {
      setMenu(res)
    })
  }, [])
  const handleClick = e => {
    if(window.location.hash.includes('/main' + e.key)) return
    props.history.push('/main' + e.key)
  }
  return (
    <div className={'mainWrap'}>
      <Header {...props}/>
      <div className={'mainContent'}>
        <Layout className='layoutWrap'>
          <Sider trigger={null} collapsible collapsed={false}>
            <Menu
              onClick={handleClick}
              style={{ textAlign: 'center' }}
              defaultSelectedKeys={['/react/rendering']}
              defaultOpenKeys={[`/react`]}
              mode="inline"
            >
              {
                menu.map(({ path, name, children, comparison }, index) => {
                  if (comparison) {
                    return <SubMenu key={path} title={name} >
                      {comparison.map(({ name: n, path: p, list }) =>
                        <Menu.ItemGroup key={p} title={n}>
                          {list.map(({ name: title, path: route }) => (
                            <Menu.Item key={route}>{title}</Menu.Item>
                          ))

                          }
                        </Menu.ItemGroup>
                      )
                      }
                    </SubMenu>
                  }
                  return  children ?   <SubMenu key={path} title={name} >
                    {children.map((item) => {
                      return <Menu.Item key="11">Option 11</Menu.Item>

                    })}
                  </SubMenu> :
                    <Menu.Item key={path}>{name}</Menu.Item>

                })
              }
            </Menu>
          </Sider>
          <Layout>
            <Content className="wrapheight" id={'contentID'} /* style={{ minHeight: ' calc(100vh - 141px)', minWidth: '920px' }} */>
              <ScrollToTops>
              <RouterView routers={props.routers}></RouterView>
              </ScrollToTops>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  )

}
