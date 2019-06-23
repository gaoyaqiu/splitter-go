<template>
  <div id="upload-view">
    <div class="fake-title-bar" :class="{ 'darwin': os === 'darwin' }">
      <div class="fake-title-bar__title">
        SplitterGo - {{ version }}
      </div>
      <div class="handle-bar" v-if="os !== 'darwin'">
        <i class="el-icon-minus" @click="minimizeWindow"></i>
        <i class="el-icon-close" @click="closeWindow"></i>
      </div>
    </div>
    <el-row style="padding-top: 22px;" :gutter="16">
      <el-col :span="20"
              :offset="2">
        <div class="view-title">
          文件内容拆分
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
            <el-form
              ref="upload"
              label-width="150px"
              :model="form"
              size="mini">
              <el-form-item
                label="设定要拆分的行数"
                prop="line">
                <el-input v-model="form.line" type="number" placeholder="默认: 1,000,00"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import pkg from 'root/package.json'
  import {remote} from 'electron'

  const {BrowserWindow} = remote

  export default {
    name: 'upload',
    data () {
      return {
        form: {
          line: ''
        },
        version: process.env.NODE_ENV === 'production' ? pkg.version : 'Dev',
        os: '',
        dragover: false,
        progress: 0,
        showProgress: false,
        showError: false
      }
    },
    created () {
      this.os = process.platform
    },
    mounted () {
      this.$electron.ipcRenderer.on('uploadProgress', (event, progress) => {
        if (progress !== -1) {
          this.showProgress = true
          this.progress = progress
        } else {
          this.progress = 100
          this.showError = true
        }
      })
    },
    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('uploadProgress')
    },
    methods: {
      onDrop (e) {
        this.dragover = false
        this.progress = 0
        this.ipcSendFiles(e.dataTransfer.files)
        document.getElementById('file-uploader').value = ''
      },
      openUplodWindow () {
        document.getElementById('file-uploader').click()
      },
      onChange (e) {
        this.progress = 0
        this.ipcSendFiles(e.target.files)
        document.getElementById('file-uploader').value = ''
      },
      ipcSendFiles (files) {
        let sendFiles = []
        Array.from(files).forEach((item, index) => {
          let obj = {
            name: item.name,
            path: item.path,
            line: this.form.line
          }
          sendFiles.push(obj)
        })

        // 向主进程发送 uploadChoosedFiles 事件
        this.$electron.ipcRenderer.send('uploadChoosedFiles', sendFiles)
      },
      minimizeWindow () {
        const window = BrowserWindow.getFocusedWindow()
        window.minimize()
      },
      closeWindow () {
        const window = BrowserWindow.getFocusedWindow()
        window.close()
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
  .el-input
    width 150px
  #upload-view
    .el-form
      label
        line-height 22px
        padding-bottom 0
        color #eee
        margin-left: 24px;
        padding-top: 4px;
      .el-input__inner
        border-radius 19px
      &-item
        margin-top: 8px
        margin-left 55px
        margin-bottom 10.5px
    .fake-title-bar
      -webkit-app-region drag
      height h = 22px
      width 100%
      text-align center
      color #eee
      font-size 12px
      line-height h
      position fixed
      z-index 100

      &.darwin
        background transparent
        background-image linear-gradient(
          to right,
          transparent 0%,
          transparent 167px,
          $darwinBg 167px,
          $darwinBg 100%
        )

      .handle-bar
        position absolute
        top 2px
        right 4px
        width 60px
        z-index 10000
        -webkit-app-region no-drag

        i
          cursor pointer
          font-size 16px

        .el-icon-minus
          &:hover
            color #409EFF

        .el-icon-close
          &:hover
            color #F15140

        .el-icon-circle-plus-outline
          &:hover
            color #69C282

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
      &__text
        font-size 12px
        margin-bottom 4px

    .paste-upload
      width 100%
</style>
