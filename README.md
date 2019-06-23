# splitter-go

> 基于`electron`开发的一款文件拆分小工具

### 本地开发

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9081
npm run dev

```

### 打包发布

指定一下`electron`的源为国内源：

* win 系统
```
set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ 

```
* 非 win 系统
```
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"

```

> 只需第一次构建的时候指定一下国内源即可。后续构建不需要特地指定。二进制文件下载在~/.electron/目录下。如果想要更新electron构建版本，可以删除~/.electron/目录，然后重新运行上一步，让electron-builder去下载最新的electron二进制文件。

* 打包命令
```
npm run build
```
---

### 应用截图

![](https://github.com/gaoyaqiu/splitter-go/blob/master/static/demo.jpg)

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
