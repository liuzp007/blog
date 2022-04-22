#!/bin/bash


if ! [ -x "$(command -v yarn)" ]; then
    echo 'Error: yarn is not installed. install yarn...' >&2
    npm install -g yarn 
fi
# function make_output() {
#     local build="build"

#         if [ -d $build ];then
#            (
#         # 拷贝build目录下的文件备份
#         cp -rf ./build/*/ &&

#         mv ${build} ${build}.old &&

#         echo -e "===== Generate build.old ok ====="
#         ) || {

#         # 填充output目录失败后, 退出码为 非0
#          echo -e "=====Generate build.old failure ====="; exit 2;
#          }
#         rm -rf $build
#         local ret=$?
#         if [ $ret -ne 0 ];then
#             echo "====== Remove $build failure ======"
#             exit $ret
#         else
#             echo "====== Remove $build success ======"
#         # 打包
#          yarn build
#             echo "======  yarn build success ======"
#         fi
#         else
#              echo "====== not find build  ======"
#         # 打包
#         yarn build
#             echo "======  yarn build success ======"

#         fi
   
# }
# make_output

# yarn install
#  yarn run build 

function runBuild (){
   
    yarn run build
}
runBuild