import {
  dialog,
  BrowserWindow,
  clipboard,
  Notification
} from 'electron'
const WEBCONTENTS = Symbol('WEBCONTENTS')
const IPCMAIN = Symbol('IPCMAIN')
const SPLITTERGO = Symbol('SPLITTERGO')

class GuiApi {
  constructor(ipcMain, webcontents, splittergo) {
    this[WEBCONTENTS] = webcontents
    this[IPCMAIN] = ipcMain
    this[SPLITTERGO] = splittergo
  }

  /**
   * for plugin to upload file
   * @param {array} input
   */
  async upload (input) {
    const imgs = await new Uploader(input, this[WEBCONTENTS], this[SPLITTERGO]).upload()
    if (imgs !== false) {
      const pasteStyle = db.read().get('settings.pasteStyle').value() || 'markdown'
      let pasteText = ''
      for (let i in imgs) {
        pasteText += pasteTemplate(pasteStyle, imgs[i]) + '\r\n'
        const notification = new Notification({
          title: '上传成功',
          body: imgs[i].imgUrl,
          icon: imgs[i].imgUrl
        })
        setTimeout(() => {
          notification.show()
        }, i * 100)
        db.read().get('uploaded').insert(imgs[i]).write()
      }
      clipboard.writeText(pasteText)
      this[WEBCONTENTS].send('uploadFiles', imgs)
      this[WEBCONTENTS].send('updateGallery')
      return imgs
    }
    return []
  }

  /**
   * For notification
   * @param {Object} options
   */
  showNotification (options = {
    title: '',
    body: ''
  }) {
    const notification = new Notification({
      title: options.title,
      body: options.body
    })
    notification.show()
  }

  /**
   *
   * @param {Object} options
   */
  showMessageBox (options = {
    title: '',
    message: '',
    type: 'info',
    buttons: ['Yes', 'No']
  }) {
    return new Promise((resolve, reject) => {
      dialog.showMessageBox(
        BrowserWindow.fromWebContents(this[WEBCONTENTS]),
        options,
        (result, checkboxChecked) => {
          resolve({
            result,
            checkboxChecked
          })
        })
    })
  }
}

export default GuiApi
