'use strict'
import {
  app,
  BrowserWindow,
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
  global.__static = require('path').join(__dirname, '../../static').replace(/\\/g, '\\\\')
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
    center: false,
    fullscreenable: false,
    resizable: true, // 是否可以调整窗口大小。默认为true
    title: 'Splitter',
    vibrancy: 'ultra-dark', // 为窗口添加一个震动效果，仅在MacOS中有效
    titleBarStyle: 'hidden'
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

  window.on('closed', () => {
    window = null
    if (process.platform === 'linux') {
      app.quit()
    }
  })

  return window
}

app.on('ready', () => {
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
