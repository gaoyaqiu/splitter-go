import fs from 'fs'
import readline from 'readline'

const splitFile = (obj) => {

  let file = obj.path
  // 定义分割之后每个文件的行数
  let rows = 100000;
  // 用来存储结果的变量
  let arr = [];
  // 创建文件流
  let readstream = fs.createReadStream(file);
  // 逐行读取
  let rl = readline.createInterface({
    input: readstream
  })

  rl.on('line', function (data) {
    arr.push(data);
  }).on('close', function () {
    for (var i = 0; i < Math.ceil(arr.length / rows); i++) {
      fs.writeFile(i + '.txt', arr.slice(i * rows, i * rows + rows).join('\r\n'));
    }
  })
}

export {
  splitFile
} 
