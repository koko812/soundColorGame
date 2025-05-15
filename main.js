const ctx = new AudioContext()
// こういう謎のコンテキストとかをバンバン試していけるようなカッティングエッジな人間になりたい

// この辺りの，いろんなコンテキストの書き方はまた使う時に便利になるので，少しずつ覚えていこう
// 百人一首でも使うと思うのでね，覚えていきましょう概念レベルでねˆ
const sleep = (duration) => new Promise(r => setTimeout(r, duration))
const gainNode = ctx.createGain()
gainNode.gain.value = 0.1

const beep = async (duration, frequency, wave = 'square') => {
    const oscillator = ctx.createOscillator()
    oscillator.frequency.value = frequency
    oscillator.type = wave
    // ここのコネクトしていく感じは，ギターのアンプの真似をしてるのか？？
    // だいたい distination ってなんなんだよ （デバイスの出力部を勝手に特定してくれてるのか？）
    oscillator.connect(gainNode).connect(ctx.destination)
    oscillator.start()
    await sleep(duration)
    oscillator.stop()
}

const size = 300
// 10 round したらクリアで，円環が回って収束したのち，弾け飛んでいくような演出をつけたい
const roundNum = 5
const buttonNum = 8
const buttonInfoList = []
const solutionList = []

const startGame = () => {
    let lastSolution = null
    let solution = null
    solution = Math.trunc(Math.random() * buttonNum)
    solutionList.push(solution)
    playSolution()
}

let playDuration = 300
let isPlayerInput = true
const playerInputList = []

const playSolution = async () => {
    console.log(solutionList);
    isPlayerInput = false
    startButtonContainer.innerHTML = `<span>level:${solutionList.length}</span>`
    for (const solution of solutionList) {
        const { element, color, frequency } = buttonInfoList[solution]
        beep(playDuration, frequency)
        element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
        // ここの sleep の duration も変えると，リズムゲームに近づくかもね
        // 普通にリズムゲームも作ってみたくなってきた
        await sleep(playDuration)
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
    }
    isPlayerInput = true
    // いつも思うけど，この配列のリセット方法はテクいよね
    playerInputList.length = 0
}

const playerInput = async (index) => {
    // ここもテクい，後ろにどんどん入っていく性質を使ってる
    const pos = playerInputList.length
    const solution = solutionList[pos]
    if (solution == index) {
        isPlayerInput = false
        playerInputList.push(index)
        const { element, color, frequency } = buttonInfoList[index]
        element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
        await beep(playDuration, frequency)
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
    } else {
        //gameover
        // ライフせいにするのはいいかもしれない（思った以上にむずかった）
        isPlayerInput = false
        startButtonContainer.innerHTML = `<span>level:${solutionList.length}</br>Game Over</span>`
        // beep の手前に await を入れると，再生中は他のが同時再生されない sleep がいらない（今更）

        await beep(100, 100, 'sawtooth')
        await sleep(100)
        await beep(1000, 100, 'sawtooth')

        // 参照は，キーの名前じゃないとできないということを忘れるミス（１敗）
        // この辺り，gameOver() 関数にまとめてしまった方がいいような気がする（データの受け渡しに苦手意識があるため，サクッと実装できない）
        const { element, color, frequency } = buttonInfoList[solution]
        console.log(pos, solution, element);
        // だいたい，この辺り，% とかをベタガキしてるのが本当によくない，隠蔽するべき，当たり前
        // codeReview は重要だな
        element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
        await sleep(500)
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
        await sleep(500)
        element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
        await sleep(500)
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
        await sleep(500)
        element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
        await sleep(500)
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
        await sleep(500)
    }

    if (solutionList.length === playerInputList.length) {
        nextStage()
    } else {
        isPlayerInput = true
        // ここで playerInput 関数を呼び出さないの，テクくていいね
        // あくまでずっと入力は受け付けてますよスタイル, gameover の可否は入力可能かのみで管理
    }
}

let rotate = 0;
const nextStage = async () => {
    const lastSolution = solutionList[solutionList.length - 1]
    while (true) {
        const solution = Math.trunc(Math.random() * buttonNum)
        if (solution !== lastSolution) {
            solutionList.push(solution)
            break
        }
    }

    // ここ，回転する度数をステージごとに増やして行きたかったんだが，適切な関数がパッと思い浮かばなかった
    drRange = 30 * (1.3 ** solutionList.length)
    console.log(1.3 ** solutionList.length, drRange);
    dr = drRange * (Math.random() * 2 - 1)
    rotate += dr
    rotateDuration = Math.max(300, Math.abs(Math.trunc(300 * (dr / 30))))
    container.style.transition = `all ${rotateDuration}ms linear`
    container.style.transform = `rotate(${rotate}deg)`
    await sleep(rotateDuration + 300)
    playSolution()
}

let startButtonContainer;
let container;

const init = () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    container.style.position = `absolute`
    container.style.width = `${size}px`
    container.style.height = `${size}px`
    //container.style.border = '1px solid'
    container.style.transform = 'rotate(0)'
    container.style.transition = 'all 300ms linear'

    for (let i = 0; i < buttonNum; i++) {
        const element = document.createElement('div')
        container.appendChild(element)
        // この辺の宣言をする時，頭の中で，もういじることがなかったら，const にできてる感じが良かったと思う
        // この辺，一つずつ宣言するんじゃなくって，
        const buttonSize = size * 0.25
        const radius = size * 0.35
        const center = size * 0.5
        const angle = 2 * Math.PI / buttonNum * i
        element.style.position = 'absolute'
        element.style.width = `${buttonSize}px`
        element.style.height = `${buttonSize}px`
        // buttonSize/2 を入れないと右下に偏る（当たり前）
        element.style.top = `${center + radius * Math.sin(angle) - buttonSize / 2}px`
        element.style.left = `${center + radius * Math.cos(angle) - buttonSize / 2}px`
        const color = i * 360 / buttonNum
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
        // （何で 50% で円になるの？という感じはある）
        element.style.borderRadius = '50%'
        // ここの音階の作り方がテクすぎる
        const frequency = 440 * (2 ** (i / buttonNum))
        buttonInfoList.push({ element, color, frequency })
        // いい感じの円環ができた，これが回ると考えるとちょっとワクワクしちゃうね
        element.onpointerdown = (e) => {
            if (isPlayerInput) {
                playerInput(i)
            } else {
                return
            }
        }
        element.onpointermove = (e) => {
            if (isPlayerInput) {
                element.style.backgroundColor = `hsl(${color}, 100%, 40%)`
            }
        }
        element.onpointerleave = (e) => {
            element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
        }
    }

    // ここで，スタートボタンのコンテナまでも用意する必要はあるんだろうか，と思った
    // タッチ判定とかそういう話？でも別にコンテナを分ける必要はなないと思うけど
    startButtonContainer = document.createElement('div')
    document.body.appendChild(startButtonContainer)
    startButtonContainer.style.position = `absolute`
    startButtonContainer.style.width = `${size}px`
    startButtonContainer.style.height = `${size}px`
    startButtonContainer.style.display = `flex`
    startButtonContainer.style.justifyContent = `center`
    startButtonContainer.style.alignItems = `center`
    startButtonContainer.style.textAlign = 'center'
    // 勝手に真ん中寄せできるのはまあ楽と言えば楽か・・・？

    const startButton = document.createElement('div')
    startButtonContainer.appendChild(startButton)
    startButton.style.backgroundColor = '#00f'
    startButton.style.width = `${size / 3}px`
    startButton.style.height = `${size / 6}px`
    startButton.style.display = `flex`
    startButton.style.justifyContent = `center`
    startButton.style.alignItems = `center`
    // これ，% 指定だとなんか形がキモくなる（なんで？）
    startButton.style.borderRadius = `${size / 20}px`
    startButton.style.color = '#fff'
    startButton.style.fontFamily = 'Times New Roman'
    startButton.style.fontSize = `${size / 12}px`
    startButton.textContent = 'Start'
    startButton.style.cursor = 'pointer'
    // 見栄えを調整するのに結構時間がかかってて，ここを手早く済ませる方法はないだろうか
    // それこそ react か？
    startButton.onpointerdown = (e) => {
        e.preventDefault()
        // 僕はまず gameStart という変数で管理しようと思ったが，t-kihira は 関数を読んだ
        startButtonContainer.style.pointerEvents = 'none'
        startButton.style.display = 'none'
        //gameStart() // gameStart より，startGame の方が，ゲームを開始するための処理ってのが伝わりやすい
        startGame()
    }
}

window.onload = () => {
    init()
}