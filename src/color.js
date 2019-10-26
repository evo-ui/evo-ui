let Color = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
};

function tranform(col, text) {
    return col + text + Color.Reset;
}

export default {
    black: (t) => tranform(Color.Black, t),
    red: (t) => tranform(Color.Red, t),
    green: (t) => tranform(Color.Green, t),
    yellow: (t) => tranform(Color.Yellow, t),
    blue: (t) => tranform(Color.Blue, t),
    magenta: (t) => tranform(Color.Magenta, t),
    cyan: (t) => tranform(Color.Cyan, t),
    white: (t) => tranform(Color.White, t),

    blackBg: (t) => tranform(Color.BgBlack, t),
    redBg: (t) => tranform(Color.BgRed, t),
    greenBg: (t) => tranform(Color.BgGreen, t),
    yellowBg: (t) => tranform(Color.BgYellow, t),
    blueBg: (t) => tranform(Color.BgBlue, t),
    magentaBg: (t) => tranform(Color.BgMagenta, t),
    cyanBg: (t) => tranform(Color.BgCyan, t),
    whiteBg: (t) => tranform(Color.BgWhite, t),

    Colors: Color
}
