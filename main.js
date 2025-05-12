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

const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    container.style.position = `absolute`
    container.style.width = `${size}px`
    container.style.height = `${size}px`
    //container.style.border = '1px solid'

    const buttonNumber = 8
    for (let i = 0; i < buttonNumber; i++) {
        const element = document.createElement('div')
        container.appendChild(element)
        // この辺の宣言をする時，頭の中で，もういじることがなかったら，const にできてる感じが良かったと思う
        const buttonSize = size * 0.25
        const radius = size * 0.35
        const center = size * 0.5
        const angle = 2 * Math.PI / buttonNumber * i
        element.style.position = 'absolute'
        element.style.width = `${buttonSize}px`
        element.style.height = `${buttonSize}px`
        // buttonSize/2 を入れないと右下に偏る（当たり前）
        element.style.top = `${center + radius * Math.sin(angle) - buttonSize / 2}px`
        element.style.left = `${center + radius * Math.cos(angle) - buttonSize / 2}px`
        element.style.backgroundColor = `hsl(${i * 360 / buttonNumber}, 100%, 50%)`
        // （何で 50% で円になるの？という感じはある）
        element.style.borderRadius = '50%'
    }



    document.onpointerdown = async (e) => {
        beep(1000, 440, 'triangle')
        await sleep(1000)
    }
}

window.onload = () => {
    init()
}