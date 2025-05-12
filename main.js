const ctx = new AudioContext()
// こういう謎のコンテキストとかをバンバン試していけるようなカッティングエッジな人間になりたい

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
const roundNum = 5
const buttonNum = 8
const buttonInfoList = []
const solutionList = []

const startGame = () => {
    let lastSolution = null
    let solution = null
    for (let i = 0; i < roundNum; i++) {
        solution = Math.trunc(Math.random() * buttonNum)
        solutionList.push(solution)
        /*
        do {
            solution = Math.trunc(Math.random() * buttonNum)
        } while (solution === lastSolution)
        solutionList.push(solution)
        lastSolution = solution
        */
    }
    playSolution()
}

let playDuration = 200
const playSolution = async () => {
    console.log(solutionList);
    for (const solution of solutionList) {
        const { element, color, frequency } = buttonInfoList[solution]
        beep(playDuration, frequency)
        element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
        await sleep(playDuration)
        element.style.backgroundColor = `hsl(${color}, 100%, 20%)`
    }
}

const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    container.style.position = `absolute`
    container.style.width = `${size}px`
    container.style.height = `${size}px`
    //container.style.border = '1px solid'

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
    }

    // ここで，スタートボタンのコンテナまでも用意する必要はあるんだろうか，と思った
    // タッチ判定とかそういう話？でも別にコンテナを分ける必要はなないと思うけど
    const startButtonContainer = document.createElement('div')
    document.body.appendChild(startButtonContainer)
    startButtonContainer.style.position = `absolute`
    startButtonContainer.style.width = `${size}px`
    startButtonContainer.style.height = `${size}px`
    startButtonContainer.style.display = `flex`
    startButtonContainer.style.justifyContent = `center`
    startButtonContainer.style.alignItems = `center`
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