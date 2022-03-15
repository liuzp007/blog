import React, { useEffect, useState } from 'react'
import { getMenu } from "../../api/serve";
import { Menu } from "antd";
import  './index.scss'
const { SubMenu } = Menu;
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

export default function Main() {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    game()
    getMenu().then((res) => {
      setMenu(res)
    })
  }, [])
  const handleClick = e => {
    console.log('click ', e);
  };
  const itemStyle = {
    textAlign:'center'
  }
  return (
    <div className={'mainWrap'}>
      <div  className={'mainContent'}> 
      <Menu
        onClick={handleClick}
        style={{ width: '13%', textAlign:'center' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={[`${menu[0]?.path}`]}
        mode="inline"
      >
        {
          menu.map(({ path, name, children, comparison },index) => {
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
            else {
              return <SubMenu key={path} title={name} >
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            }
          })
        }

      </Menu>
      </div>
    </div>
  )

}
