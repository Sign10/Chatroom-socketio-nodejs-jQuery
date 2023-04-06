<h1 align="center">ChatRoom</h1>

> 此聊天室基于socketio框架与nodejs搭建express服务端，使用jQuery库进行代码的编写。

---


## 下载&使用
1.  [下载](https://codeload.github.com/Sign10/Chatroom-socketio-nodejs-jQuery/zip/refs/heads/main) 源代码；
2. 将服务端的nodejs程序打包上传到宝塔面板的网站目录后，使用PM2管理器运行；
3. 将客户端的JS文件中的io.connect地址指向自己的服务端地址；

## 可能会出现的BUG
1、客户端的io.connect连接服务端时路径自行发生变化，不能正确连接到服务端的路径，此时需要添加path对象，手动设置需要具体连接到的socketio服务URL；

## 建议&意见
代码由本人自学编写，因此可能会出现代码书写不规范或冗余的情况，还请各位不吝赐教，能够为我提出宝贵的建议。
mail: sign10@163.com

<br/>blog: signten.cn
