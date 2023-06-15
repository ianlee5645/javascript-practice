// 获取元素DOM
const containerDOM = document.querySelector('#container')
const imgsList = document.querySelector('.imgs-list')
const leftBtn = document.querySelector('#leftBtn')
const rightBtn = document.querySelector('#rightBtn')
const navList = document.querySelector('.nav-list')
const navs = document.querySelectorAll('.nav-item')

// 定义三个变量，用来存储当前位置，定时器，节流阀
let currentIndex = 0
let timer = null
let lock = false

// 绑定事件
rightBtn.addEventListener('click', nextFunc)
leftBtn.addEventListener('click', prevFunc)
containerDOM.addEventListener('mouseenter', stopMove)
containerDOM.addEventListener('mouseleave', move)
navList.addEventListener('click', navClick)

// 开启自动轮播
move()

// 切换下一张图片
function nextFunc() {
    if (lock) return
    lock = true  /* 锁住 */
    imgsList.style.transition = '0.5s'  /* 添加上过渡效果，因为最后一张回到第一张的时候，取消了过渡 */
    currentIndex++
    if (currentIndex > 4) {
        // 需要使用异步任务将最后一张图片不用动画回到第一张，否则页面重绘的时候是不会有效果的
        setTimeout(() => {
            imgsList.style.transition = 'none'  /* 移除过渡效果 */
            imgsList.style.left = 0
            currentIndex = 0
        }, 500)
    }
    imgsList.style.left = -currentIndex * 800 + 'px'
    // 显示小圆点的样式，但是当切换到最后一张的时候应该让第一个小圆点显示样式效果
    if(currentIndex < 5) {
        navStyleShow()
    } else {
        navStyleShow(0)
    }
    // 节流
    setTimeout(() => {
        lock = false
    }, 500)
}

function prevFunc() {
    if (lock) return
    lock = true
    // 如果当前是第一张图片的话，应该先无动画去往最后一张，然后有动画去往倒数第二张；不是第一张就正常切换至前一张
    if (currentIndex === 0) {
        imgsList.style.transition = 'none'
        imgsList.style.left = -5 * 800 + 'px'
        // 使用异步任务，避免同步任务导致重绘时不出现对应的效果
        setTimeout(() => {
            imgsList.style.transition = '0.5s'
            currentIndex = 4
            imgsList.style.left = -currentIndex * 800 + 'px'
            navStyleShow()
        }, 0)
    } else {
        currentIndex--
        imgsList.style.left = -currentIndex * 800 + 'px'
        navStyleShow()
    }
    // 节流
    setTimeout(() => {
        lock = false
    }, 500)
}

// 停止轮播
function stopMove() {
    clearInterval(timer)
}

// 开始轮播
function move() {
    timer = setInterval(nextFunc, 2000)
}

// 点击小圆点
function navClick(event) {
    // 获取元素上自定义的属性
    const index = event.target.dataset.index
    if (index) {
        imgsList.style.transition = '0.5s'
        currentIndex = +index  /* 将字符串转换为数值 */
        imgsList.style.left = -currentIndex * 800 + 'px'
        navStyleShow()
    }
}

// 排他思想：先清除所有元素的样式，然后添加对应元素的样式
function navStyleShow(idx = currentIndex) {
    navs.forEach(nav => nav.classList.remove('active'))
    navs[idx].classList.add('active')
}