import React, { useEffect, useState } from 'react'
import { getMenu } from "../../api/serve";
import { Menu, Layout } from "antd";
import RouterView from '../../router/router_view'
import Header from '../../components/header'
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

export default function Main(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    game()
    getMenu().then((res) => {
      setMenu(res)
    })
  }, [])
  const handleClick = e => {
    props.history.push('/main' + e.key)
  };

  return (
    <div className={'mainWrap'}>
      <Header />
      <div className={'mainContent'}>
        <Layout className='layoutWarp'>
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
                    console.log(path)
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
                  return children ? <SubMenu key={path} title={name} >
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
            <Content className="warpheight" /* style={{ minHeight: ' calc(100vh - 141px)', minWidth: '920px' }} */>
              <RouterView routers={props.routers}></RouterView>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  )

}
