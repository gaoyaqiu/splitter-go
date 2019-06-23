module.exports = {
  // 一旦配置了root，ESlint停止在父级目录中查找配置文件
  root: true,
  // 解析器
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // 代码运行的环境，每个环境都会有一套预定义的全局对象，不同环境可以组合使用
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
