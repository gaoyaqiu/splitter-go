<template>
  <div id="upload-view">
    <el-row :gutter="16">
      <el-col :span="20"
              :offset="2">
        <div class="view-title">
          文件上传
        </div>
        <div id="upload-area"
             :class="{ 'is-dragover': dragover }"
             @drop.prevent="onDrop"
             @dragover.prevent="dragover = true"
             @dragleave.prevent="dragover = false">
          <div id="upload-dragger"
               @click="openUplodWindow">
            <i class="el-icon-upload"></i>
            <div class="upload-dragger__text">
              将文件拖到此处，或 <span>点击上传</span>
            </div>
            <input type="file"
                   id="file-uploader"
                   @change="onChange"
                   multiple>
          </div>
        </div>
        <el-progress :percentage="progress"
                     :show-text="false"
                     class="upload-progress"
                     :class="{ 'show': showProgress }"
                     :status="showError ? 'exception' : 'text'"></el-progress>
        <div class="paste-style">
          <div class="el-col-16">
            <div class="paste-style__text">
              一个文件N行
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { splitFile } from '@/utils/handleSplit'
export default {
  name: 'upload',
  data () {
    return {
    }
  },
  mounted () {
  },
  beforeDestroy () {
    this.$electron.ipcRenderer.removeAllListeners('uploadProgress')
    this.$electron.ipcRenderer.removeAllListeners('syncPicBed')
    this.$electron.ipcRenderer.removeListener('getPicBeds', this.getPicBeds)
  },
  methods: {
    openUplodWindow () {
      document.getElementById('file-uploader').click()
    },
    onChange (e) {
      this.ipcSendFiles(e.target.files)
      document.getElementById('file-uploader').value = ''
    },
    ipcSendFiles (files) {
      let sendFiles = []
      Array.from(files).forEach((item, index) => {
        let obj = {
          name: item.name,
          path: item.path
        }
        sendFiles.push(obj)
        splitFile(obj)
      })
      //this.$electron.ipcRenderer.send('uploadChoosedFiles', sendFiles)
    }
  }
}
</script>
<style lang='stylus'>
.view-title
  color #eee
  font-size 20px
  text-align center
  margin 10px auto
#upload-view
  background transparentify(#172426, #000, 0.7)
  .view-title
    margin 20px auto
  #upload-area
    height 220px
    border 2px dashed #dddddd
    border-radius 8px
    text-align center
    width 450px
    margin 0 auto
    color #dddddd
    cursor pointer
    transition all 0.2s ease-in-out
    #upload-dragger
      height 100%
    &.is-dragover, &:hover
      border 2px dashed #A4D8FA
      background-color rgba(164, 216, 250, 0.3)
      color #fff
    i
      font-size 66px
      margin 50px 0 16px
      line-height 66px
    span
      color #409EFF
  #file-uploader
    display none
  .upload-progress
    opacity 0
    transition all 0.2s ease-in-out
    width 450px
    margin 20px auto 0
    &.show
      opacity 1
    .el-progress-bar__inner
      transition all 0.2s ease-in-out
  .paste-style
    text-align center
    margin-top 16px
    &__text
      font-size 12px
      color #eeeeee
      margin-bottom 4px
  .el-radio-button:first-child
    .el-radio-button__inner
      border-left none
  .el-radio-button:first-child
    .el-radio-button__inner
      border-left none
      border-radius 14px 0 0 14px
  .el-radio-button:last-child
    .el-radio-button__inner
      border-left none
      border-radius 0 14px 14px 0
  .paste-upload
    width 100%
</style>
