import React, { useEffect } from 'react'

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
  console.log("*    '/,'          (  Uu", )
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
  console.log("time:",time.toLocaleDateString())

}

export default function  Main() {
  useEffect(()=>{
    game()
  },[])

    return (
      <h1 style={{ textAlign: "center", fontSize: '22px' }}>
        🐎🐎🐎正在开发中...

      </h1>
    )
  
}
