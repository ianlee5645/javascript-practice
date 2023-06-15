// 获取容器元素
const wrapEL = document.querySelector('.wrap')
// 获取图片容器
const imgUl = document.querySelector('.wrap .imgs-wrap')
const leftBtn = document.querySelector('.wrap .left')
const rightBtn = document.querySelector('.wrap .right')
const numUl = document.querySelector('.wrap .number-wrap')
const numList = document.querySelectorAll('.wrap .number-wrap .num')

// 定义保存当前图片索引的变量
let currentIndex = 0
// 定义保存定时器的变量
let timer = null

// 绑定事件
leftBtn.addEventListener('click', prevFunc)
rightBtn.addEventListener('click', nextFunc)
numUl.addEventListener('click', numFunc)
wrapEL.addEventListener('mouseenter', stopPlay)
wrapEL.addEventListener('mouseleave', aotuPlay)


aotuPlay()
// 切换上一张图片
function prevFunc() {
    imgUl.style.transition = '0.5s'
    if (currentIndex === 0) {
        // 第一张图片去往最后一张图片时，取消过渡效果
        imgUl.style.transition = '0s'
        currentIndex = 4
    } else {
        currentIndex--
    }
    imgUl.style.left = -currentIndex * 600 + 'px'
    numShow()
}

// 切换下一张图片
function nextFunc() {
    imgUl.style.transition = '0.5s'
    if (currentIndex === 4) {
        // 最后一张图片回到第一张图片时，取消过渡效果
        imgUl.style.transition = '0s'
        currentIndex = 0
    } else {
        currentIndex++
    }
    imgUl.style.left = -currentIndex * 600 + 'px'
    numShow()
}

// 点击数字切换图片
function numFunc(event) {
    imgUl.style.transition = '0.5s'
    // 获取自定义属性
    const index = event.target.getAttribute('data-index')
    if (index) {
        // +运算符将字符串转为数值
        currentIndex = +index
        imgUl.style.left = -currentIndex * 600 + 'px'
        numShow()
    }
}

// 鼠标进入图片时停止轮播
function stopPlay() {
    clearInterval(timer)
}

// 数字显示样式
function numShow() {
    numList.forEach(num => num.classList.remove('active'))
    numList[currentIndex].classList.add('active')
}

// 开启轮播
function aotuPlay() {
    timer = setInterval(nextFunc, 2000)
}