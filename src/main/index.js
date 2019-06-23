'use strict'

import Splitter from './utils/splitter.js'
import {app, BrowserWindow, ipcMain, Notification} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let window
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9081`
  : `file://${__dirname}/index.html`

const createWindow = () => {
  if (process.platform !== 'darwin' && process.platform !== 'win32') {
    return
  }
  const options = {
    height: 450,
    width: 800,
    show: true,
    frame: true, // 创建无边框窗口
    center: true,
    fullscreenable: false, // 窗口是否可以进入全屏状态
    resizable: true, // 是否可以调整窗口大小。默认为true
    title: 'Splitter',
    vibrancy: 'ultra-dark', // 为窗口添加一个震动效果，仅在MacOS中有效
    transparent: true, // 使窗口 透明. 默认值为 false
    titleBarStyle: 'hidden', // 窗口标题栏的样式. 默认值为 default
    webPreferences: { // 网页功能的设置
      backgroundThrottling: false, // 是否在页面成为背景时限制动画和计时器
      nodeIntegration: true, // 是否与node集成
      nodeIntegrationInWorker: true, // 是否在Web工作器中启用了Node集成. 默认值为 false
      webSecurity: false // 当设置为 false, 它将禁用同源策略 (通常用来测试网站), 默认为 true
    }
  }
  if (process.platform !== 'darwin') {
    options.show = false
    options.frame = false
    options.backgroundColor = '#3f3c37'
    options.transparent = false
    options.icon = `${__static}/logo.png`
  }
  window = new BrowserWindow(options)
  window.loadURL(winURL)

  // 当 window 被关闭，这个事件会被触发
  window.on('closed', () => {
    window = null
    if (process.platform === 'linux') {
      app.quit()
    }
  })

  return window
}

// 监听 uploadChoosedFiles 事件
ipcMain.on('uploadChoosedFiles', async (evt, files) => {
  return uploadChoosedFiles(evt.sender, files)
})

const uploadChoosedFiles = async (webContents, files) => {
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    const fs = await new Splitter(file, webContents).split()
    if (fs !== false) {
      const notification = new Notification({
        title: '拆分成功',
        body: '到dowload目录下看看吧'
      })
      setTimeout(() => {
        notification.show()
      }, 100)
    }
  }
}

app.on('ready', () => {
  // 创建主窗口
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (window === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') {
//     autoUpdater.checkForUpdates()
//   }
// })
