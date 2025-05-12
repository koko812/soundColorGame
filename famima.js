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

// もはや簡単な MIDI みたいなものを作った方が良さそうな気がするよね
// 音ばんメモアプリってことね（天才の発想）
// この辺りの入力があまりにもめんどくさかったので，正規表現や，ワンライナーなどでうまく扱いたかった
notesFreqMap = { 'ド': 261, 'レ': 293, 'ミ': 329, 'ファ': 349, 'ソ': 391, 'ラ': 440, 'シ': 493, 'hiド': 523, 'hiレ': 587 }
famimaNotes = ['シ', 'ソ', 'レ', 'ソ', 'ラ', 'hiレ', 'hiレ', 'レ', 'ラ', 'シ', 'ラ', 'レ', 'ソ', 'ソ']

const init = () => {
    document.onpointerdown = async (e) => {
        for (const note of famimaNotes) {
            beep(500, notesFreqMap[note], 'triangle')
            await sleep(500)
        }
    }
}

window.onload = () => {
    init()
}