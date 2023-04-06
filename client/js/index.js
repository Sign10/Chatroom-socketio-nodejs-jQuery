    // 连接到服务器，指定路径
var socket = io.connect('https://signten.cn', { path: '/chatsocket.io' });
var username, avatar

    // 渐变出现
$(document).ready(function () {
    $('body').fadeIn(500);
});



    // 头像选中加边框
$('#login_avatar li img').on('click', function () {
    $(this).addClass('now').parent().siblings().find('img').removeClass('now');

})




    // 按钮被点击后
$('#loginBtn').on('click', function () {
    //获取用户名
    var username = $('#username').val().trim()
    if (!username) {
        alert('Please enter the username')
        return
    }
    // 获取头像
    var avatar = $('#login_avatar li img.now').attr('src')
    if (!avatar) {
        alert('Please choose the avatar')
        return
    }
    // 向服务器发送信息
    socket.emit('login', {
        username,
        avatar,
    })
})


    // 登录失败，监听到服务端的事件
socket.on('loginError', () => {
    alert('The same username is already in the chat room')
})
    //登录成功，坚挺到服务端的事件
socket.on('loginSuccess', data => {

    // 登录框消失，聊天框出现
    $('.login_box').slideUp()
    $('.container').show()

    // 获取头像和用户名
    $('.avatar_url').attr('src', data.avatar)
    $('.user-list .username').text(data.username)

    username = data.username
    avatar = data.avatar

    //让背景变得模糊，css3的属性
    $('body').css({
        'backdrop-filter': 'blur(5px)'
    })
})


    //系统消息。添加谁进来的消息
socket.on('addUser', data => {
    $('.box-sys').append(
        `<div class="system">
    <p class="message_system">
        <span class="content">${data.username}加入了群聊</span>
    </p>

</div>`
    )
    scrollIntoView2()
})

    //更新用户列表
socket.on('userList', data => {
    //首先先将ul里的数据清空
    $('.user-list ul').html('')
    // 使用foreach将data的数据给到item，item使用函数完成操作
    data.forEach(item => {
        $('.user-list ul').append(`
    <li class="user">
        <div class="avatar"><img src="${item.avatar}" alt=""></div>
        <div class="name">${item.username}</div>
    </li>
    `)
    });
    //记录聊天室的人数
    $('#userCount').text(data.length)

})

    //监听服务端事件，显示离开群里的系统信息
socket.on('delUser', data => {
    $('.box-sys').append(
        `<div class="system">
        <p class="message_system">
            <span class="content">${data.username}离开了群聊</span>
        </p>
    
    </div>`
    )
    scrollIntoView2()
})

    // 点击发送按钮，发送消息
$('.btn-send').on('click', () => {
    var content = $('#content').val().trim()//获取输入框的值，并去掉空格
    $('#content').val('')//获取之后，值变为0
    if (!content) return alert('please input the content')
    // 向服务器发消息
    socket.emit('sendMessage', {
        msg: content,
        username: username,
        avatar: avatar
    })
})

    // 设置空格发送消息
$('.text').on('keypress', (event) => {
    if (event.key === "Enter") {
        event.preventDefault()//取消空格原来的默认行为
        var content = $('#content').val().trim()
        $('#content').val('')
        if (!content) return alert('please input the content')
        socket.emit('sendMessage', {
            msg: content,
            username: username,
            avatar: avatar
        })
    }
})
    // 消息更新
socket.on('receieveMessage', data => {
    // 我的消息
    if (data.username === username) {
        $('.box-bd').append(`
    <div class="message-box1">
    <div class="mymessage">
        <img class="avatar" src="${data.avatar}" alt="">
       <div class="content">
           <div class="bubble">
               <div class="bubble_cont">${data.msg}</div>
            </div>
        </div> 
    </div>
    </div>
            `)
    } else {
    // 别人的消息
        $('.box-bd').append(`
    <div class="message-box2">
    <div class="othermessage">
    <img  class="avatar" src="${data.avatar}" alt="">
    <div class="content">
        <div class="nickname">${data.username}</div>
        <div class="bubble">
            <div class="bubble_cont">${data.msg}</div>
        </div>
    </div>

    </div>
    </div>`)
    }
    // 视图拉到最低
    scrollIntoView()
})

    // 视图更新函数
function scrollIntoView() {
    $('.box-bd').children(':last').get(0).scrollIntoView(false)
}
function scrollIntoView2() {
    $('.box-sys').children(':last').get(0).scrollIntoView(false)
}