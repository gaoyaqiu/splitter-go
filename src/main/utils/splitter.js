import {app, Notification} from 'electron'
import fs from 'fs'
import readline from 'readline'

// 用户下载目录的路径
const STORE_PATH = app.getPath('downloads')

class Splitter {
  constructor(file, webContents) {
    this.file = file
    this.webContents = webContents
  }

  split() {
    let webContents = this.webContents
    let filePath = this.file.path
    let fileName = this.file.name
    let rows = this.file.line
    // 后缀名
    let suffix = ''
    let flieSpArr = []
    if (rows === '' || rows <= 0) {
      // 定义分割之后每个文件的行数, 默认为 10W
      rows = 100000
    }

    return new Promise((resolve) => {
      try {
        flieSpArr = fileName.split('.')
        suffix = flieSpArr[flieSpArr.length - 1]
      } catch (err) {
        suffix = ''
      }

      // fileName无后缀或者不是txt文件返回 false
      if (!suffix || suffix !== 'txt') {
        const notification = new Notification({
          title: '拆分失败',
          body: '别闹，我只能帮你拆分txt格式的文件'
        })
        notification.show()
        resolve(false)
        return
      }
      // 用来存储结果的变量
      let result = []
      let curSize = 0
      let progress = 0
      // 创建文件流
      let readstream = fs.createReadStream(filePath)
      // 逐行读取
      let rl = readline.createInterface({
        input: readstream
      })

      // 每当 input 流接收到接收行结束符（\n、\r 或 \r\n）时触发 'line' 事件
      rl.on('line', function (data) {
        result.push(data)
      })
      rl.on('close', function () {
        for (let i = 0; i < Math.ceil(result.length / rows); i++) {
          fs.writeFile(STORE_PATH + '/' + flieSpArr[0] + '_' + (i + 1) + '.txt', result.slice(i * rows, i * rows + rows).join('\r\n'))
          curSize += rows
          progress = (curSize / result.length * 100).toFixed(0)
          // console.log('读取中：' + progress)
          webContents.send('uploadProgress', parseInt(progress))
        }
        resolve(true)
      })
    })
  }
}

export default Splitter
