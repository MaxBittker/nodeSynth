var _ = require('underscore')
var fs = require('fs')

writeTone = (PCM) => {
    var min = 0 //_.min(PCM)
    var max = 1000 //_.max(PCM)
    // console.log(PCM)
    var output = _.map(PCM, (value) => Math.round((value - min) / (max - min) * 255))
        // console.log(output)
    var header = fs.readFileSync("header.wav", "", 'binary');
    fs.writeFileSync("output.wav", header, 'binary');
    _.each(output, value => {
        fs.appendFileSync("output.wav", String.fromCharCode(value), 'binary');
    })
}

add = (tones, weights) => {
    if (!weights)
        weights = _.map(_.range(tones.length), (i) => 1)
        //normalize weights
    var weights = _.map(weights, (w) => w / _.reduce(weights, (sum, v) => sum + v))

    return _.map(tones[0], (val, i) =>
        _.reduce(tones, (sum, tone, ti) =>
            sum + (tone[i] * weights[ti]), 0)
    )
}

soften = (PCM, d) => {
    if (!d)
        d = .5
    var rollingAvg = getAvg(PCM)
    return _.map(PCM, (val) => {
        rollingAvg = (val * (1 - d)) + (rollingAvg * d)
        return rollingAvg
    })
}
offset = (PCM, ofs) =>
    _.map(PCM, (value) => value + ofs)

getAvg = (PCM) =>
    _.reduce(PCM, (sum, val) => sum + val) / PCM.length

saw = (freq, amp) =>
    _.map(_.range(50000), (i) => (i * freq) % amp)

sin = (freq, amp) =>
    _.map(_.range(50000), (i) => ((Math.sin(i * freq / 1000) + 1) / 2) * amp)

square = (freq, amp) =>
    _.map(_.range(50000), (i) =>
        (((i % (freq * 2)) < freq) ? 1 : 0) * amp)

noise = (amp) =>
    _.map(_.range(50000), (i) => Math.random() * amp)


// writeTone(square(20, 300))
    writeTone(offset(add([sin(200, 200), sin(300, 1500)]), 150))
    // writeTone(noise(500, 0))
    // writeTone(add([flatTone(5), noise(200, 500)], [1, 2]))
    // writeTone(soften(add([saw(5), saw(7)], [1, 1]), .999))
