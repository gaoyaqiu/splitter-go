<template>
  <div id="index-page">
    <div class="fake-title-bar"
         :class="{ 'darwin': os === 'darwin' }">
      <div class="fake-title-bar__title">
        Splitter - {{ version }}
      </div>
      <div class="handle-bar"
           v-if="os !== 'darwin'">
        <i class="el-icon-minus"
           @click="minimizeWindow"></i>
        <i class="el-icon-circle-plus-outline"
           @click="openMiniWindow"></i>
        <i class="el-icon-close"
           @click="closeWindow"></i>
      </div>
    </div>
    <el-row style="padding-top: 22px;"
            class="main-content">
      <el-col :span="5"
              class="side-bar-menu">
        <el-menu class="picgo-sidebar"
                 :default-active="defaultActive"
                 @select="handleSelect"
                 :unique-opened="true">
          <el-menu-item index="upload">
            <i class="el-icon-upload"></i>
            <span slot="title">上传区</span>
          </el-menu-item>
          <el-menu-item index="gallery">
            <i class="el-icon-picture"></i>
            <span slot="title">文件</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="19"
              :offset="5"
              style="height: 428px"
              class="main-wrapper"
              :class="{ 'darwin': os === 'darwin' }">
        <transition name="picgo-fade"
                    mode="out-in">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
        </transition>
        <transition name="picgo-fade"
                    mode="out-in">
          <router-view :key="$route.path"
                       v-if="!$route.meta.keepAlive"></router-view>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { remote } from 'electron'
import mixin from '@/utils/mixin'
const { Menu, dialog, BrowserWindow } = remote
export default {
  name: 'index-page',
  mixins: [mixin],
  data () {
    return {
      version: process.env.NODE_ENV === 'production' ? pkg.version : 'Dev',
      defaultActive: 'upload',
      menu: null,
      visible: false,
      os: '',
      // for showInputBox
      showInputBoxVisible: false,
      inputBoxValue: '',
      inputBoxOptions: {
        title: '',
        placeholder: ''
      }
    }
  },
  created () {
    console.log('index created')
    this.os = process.platform
    this.$electron.ipcRenderer.on('showInputBox', (evt, options) => {
      this.inputBoxValue = ''
      this.inputBoxOptions.title = options.title || ''
      this.inputBoxOptions.placeholder = options.placeholder || ''
      this.showInputBoxVisible = true
    })
  },
  methods: {
    handleSelect (index) {
      this.$router.push({
        name: index
      })
    },
    minimizeWindow () {
      const window = BrowserWindow.getFocusedWindow()
      window.minimize()
    },
    closeWindow () {
      const window = BrowserWindow.getFocusedWindow()
      window.close()
    },
    openDialog () {
      this.menu.popup(remote.getCurrentWindow())
    },
    keyDetect (type, event) {
      this.shortKey[type] = keyDetect(event).join('+')
    },
    openMiniWindow () {
      this.$electron.ipcRenderer.send('openMiniWindow')
    },
    getPicBeds (event, picBeds) {
      this.picBed = picBeds
    },
    handleInputBoxClose () {
      this.$electron.ipcRenderer.send('showInputBox', this.inputBoxValue)
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.defaultActive = to.name
    })
  },
  beforeDestroy () {
    this.$electron.ipcRenderer.removeListener('getPicBeds', this.getPicBeds)
    this.$electron.ipcRenderer.removeAllListeners('showInputBox')
  }
}
</script>
<style lang='stylus'>
$darwinBg = transparentify(#172426, #000, 0.7)
.picgo-fade
  &-enter, &-leave, &-leave-active
    opacity 0
  &-enter-active, &-leave-active
    transition all 100ms linear
.view-title
  color #eee
  font-size 20px
  text-align center
  margin 10px auto
#index-page
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
      .fake-title-bar__title
        padding-left 167px
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
  .main-wrapper
    &.darwin
      background $darwinBg
  .side-bar-menu
    position fixed
    height calc(100vh - 22px)
    overflow-x hidden
    overflow-y auto
    width 170px
    .el-icon-info.setting-window
      position fixed
      bottom 4px
      left 4px
      cursor poiter
      color #878d99
      transition 0.2s all ease-in-out
      &:hover
        color #409EFF
  .el-menu
    border-right none
    background transparent
    width 170px
    &-item
      color #eee
      position relative
      &:focus, &:hover
        color #fff
        background transparent
      &.is-active
        color active-color = #409EFF
        &:before
          content ''
          position absolute
          width 3px
          height 20px
          right 0
          top 18px
          background active-color
  .el-submenu__title
    span
      color #eee
    &:hover
      background transparent
      span
        color #fff
  .el-submenu
    .el-menu-item
      min-width 166px
      &.is-active
        &:before
          top 16px
  .main-content
    padding-top 22px
    position relative
    z-index 10
  .el-dialog__body
    padding 20px
  .support
    text-align center
    &-title
      text-align center
      color #878d99
  .align-center
    input
      text-align center
  *::-webkit-scrollbar
    width 8px
    height 8px
  *::-webkit-scrollbar-thumb
    border-radius 4px
    background #6f6f6f
  *::-webkit-scrollbar-track
    background-color transparent
</style>