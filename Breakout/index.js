// 获取元素DOM
const canvas = document.querySelector('#canvas')
// 定义变量，存储2d绘图上下文，分数，每行的砖块数，每列的砖块数
const ctx = canvas.getContext('2d')

// 球类
class Ball {
    constructor(size = 10, speed = 4) {
        this.x = canvas.width / 2
        this.y = canvas.width / 2
        this.size = size
        this.speed = speed
        this.dx = speed
        this.dy = -speed
        this.visible = true
    }

    // 绘制球
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.visible ? '#0095dd' : 'transparent'
        ctx.fill()
        ctx.closePath()
    }

    // 球移动
    move() {
        this.x += this.dx
        this.y += this.dy
    }
}

// 球拍类
class Paddle {
    constructor(width = 80, height = 10, speed = 8) {
        this.x = canvas.width / 2 - width / 2
        this.y = canvas.height - 20
        this.width = width
        this.height = height
        this.speed = speed
        this.dx = 0
        this.visible = true
    }

    // 绘制球拍
    draw() {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.visible ? '#0095dd' : 'transparent'
        ctx.fill()
        ctx.closePath()
    }

    // 移动球拍
    move() {
        this.x += this.dx
    }
}

// 砖块类
class Brick {
    constructor() {
        this.width = 70
        this.height = 20
        this.gap = 10
        this.offsetX = 45
        this.offsetY = 60
        this.visible = true
    }
}

// 计分类
class Score {
    constructor(step = 1) {
        this.value = 0
        this.step = step
    }

    // 绘制分数
    draw() {
        ctx.font = '20px Arial'
        ctx.fillText(`Score: ${this.value}`, canvas.width - 100, 30)
    }

    // 加分
    increase() {
        this.value += this.step
    }
}

// 游戏控制器类
class GameControl {
    constructor() {
        this.ball = new Ball()
        this.paddle = new Paddle()
        this.score = new Score()
        this.brick = new Brick()
        this.requestID = null
        this.bricks = []
        this.brickColumns = 9
        this.brickRows = 5
        this.isOver = false  /* 标志是否失败 */
        this.isWin = false  /* 标志是否成功 */
        this.init()  /* 初始化 */
    }

    // 创建砖块
    createBrickes() {
        // 双循环保存所有砖块的信息
        for (let i = 0; i < this.brickColumns; i++) {
            this.bricks[i] = []
            for (let j = 0; j < this.brickRows; j++) {
                const x = i * (this.brick.width + this.brick.gap) + this.brick.offsetX
                const y = j * (this.brick.height + this.brick.gap) + this.brick.offsetY
                this.bricks[i][j] = { ...this.brick, x, y }
            }
        }
    }

    // 绘制砖块
    drawBricks() {
        this.bricks.forEach(column => {
            column.forEach(brick => {
                ctx.beginPath()
                ctx.rect(brick.x, brick.y, brick.width, brick.height)
                ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'
                ctx.fill()
                ctx.closePath()
            })
        })
    }

    // 处理球碰撞的情况
    checkBall() {
        // 处理球与墙左右相碰撞的情况
        if (this.ball.x + this.ball.size > canvas.width || this.ball.x - this.ball.size < 0) {
            this.ball.dx *= -1
        }

        // 球与顶部相撞
        if (this.ball.y - this.ball.size < 0) {
            this.ball.dy *= -1
        }

        // 球与拍相碰
        if
            (this.ball.x - this.ball.size > this.paddle.x &&
            this.ball.x + this.ball.size < this.paddle.x + this.paddle.width &&
            this.ball.y + this.ball.size > this.paddle.y
        ) {
            this.ball.dy = -this.ball.speed
        }

        // 球与底部相碰
        if (this.ball.y + this.ball.size > canvas.height) {
            this.isOver = true
        }

        // 球与砖块相碰
        this.bricks.forEach(column => {
            column.forEach(brick => {
                if (brick.visible) {
                    if (this.ball.x - this.ball.size > brick.x &&
                        this.ball.x + this.ball.size < brick.x + brick.width &&
                        this.ball.y - this.ball.size < brick.y + brick.height &&
                        this.ball.y + this.ball.size > brick.y) {
                        this.ball.dy *= -1
                        brick.visible = false
                        this.score.increase()
                        // 判断是否全部相碰
                        if(this.score.value % this.brickRows * this.brickColumns === 0) {
                            this.isWin = true
                        }
                    }
                }
            })
        })
    }

    // 边界处理
    checkPaddle() {
        if (this.paddle.x + this.paddle.width > canvas.width) {
            this.paddle.x = canvas.width - this.paddle.width
        }

        if (this.paddle.x < 0) {
            this.paddle.x = 0
        }
    }

    // 绘制
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.ball.draw()
        this.paddle.draw()
        this.score.draw()
        this.drawBricks()
    }

    // 更新
    update() {
        this.paddle.move()
        this.checkPaddle()
        this.ball.move()
        this.checkBall()
        this.draw()
        // 需要注意cancelAnimationFrame方法调用的时机，否则有可能不生效
        if(this.isOver) {
            this.gameOver()
        } else if(this.isWin) {
            this.gameWin()
        } else {
          this.requestID = requestAnimationFrame(this.update.bind(this))
        }
    }

    // 游戏结束
    gameOver() {
        window.cancelAnimationFrame(this.requestID)
        this.reset()
        alert('You Lose!')
    }

    gameWin() {
        window.cancelAnimationFrame(this.requestID)
        this.reset()
        alert('You Win!')
    }

    // 初始化
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                this.update()
            }

            if (e.key === 'Right' || e.key === 'ArrowRight') {
                this.paddle.dx = this.paddle.speed
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                this.paddle.dx = -this.paddle.speed
            }
        })

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
                this.paddle.dx = 0
            }
        })

        this.createBrickes()
        this.draw()
    }

    // 重置
    reset() {
        this.score.value = 0
        this.paddle.x = canvas.width / 2 - 40;
        this.paddle.y = canvas.height - 20;
        this.ball.x = canvas.width / 2;
        this.ball.y = canvas.height / 2;
        this.ball.dy *= -1
        this.ball.dx = this.ball.speed
        this.paddle.dx = 0
        this.isOver = false


        this.bricks.forEach(column => {
            column.forEach(brick => brick.visible = true)
        })

        this.draw()

    }
}

const gameControl = new GameControl()