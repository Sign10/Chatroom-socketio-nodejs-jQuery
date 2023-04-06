const https = require('http');
const hostname = '0.0.0.0';
const port = 3000;
const app = require('express')();
const server = https.createServer(options, app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['https://chat.signten.cn/', 'https://signten.cn/'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});
//储存登录的用户
const users = [];
server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});
//网页重定向
app.get('/', function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});


//一旦有用户连接，触发回调函数
io.on('connection', function (socket) {

  //监听到客户端的事件login，接收到对象data
  socket.on('login', data => {
    let user = users.find(item => item.username === data.username)
    if (user) {
      //如果user存在
      socket.emit('loginError', { msg: '登录失败' })
      console.log('登录失败');
    }
    else {
      //将数据存在data
      users.push(data)
      // 向客户端发送事件
      socket.emit('loginSuccess', data);

      //所有连接到服务器的用户进行广播
      io.emit('addUser', data)
      io.emit('userList', users)

      //为下面的断开连接做准备
      socket.username = data.username
      socket.avatar = data.avatar
    }
  })


  // 断开连接后执行一个回调函数
  socket.on('disconnect', () => {
    {
      // 在服务器端对这个user进行删除,包括名字和对象
      let idx = users.findIndex(item => item.username === socket.username)
      // 删除这个用户
      users.splice(idx, 1)

      //全频道进行广播
      io.emit('delUser', {
        username: socket.username,
        avatar: socket.avatar
      })
       // 更新userList
      io.emit('userList', users)
     
    }
  })
  // 监听到客户端法搜的消息信息，执行回调
  socket.on('sendMessage', data => {
    //向所有用户广播，向客户端发送事件
    io.emit('receieveMessage', data)
  })

});