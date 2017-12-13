let input_stdin = "";
let input_stdin_array = "";
let input_currentline = 0;

/// Test input from .txt ///
if (process.argv.length === 3) {
    var fs = require('fs')
        , filename = process.argv[2];
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) throw err;
        console.log('Test case, ok: ' + filename);
        input_stdin_array = data.split("\n");
        main();
    });
}
/// Std input from interactive shell ///
else {
    process.stdout.write("Key in number of test cases <<Enter>>\nKey in number of pins <<Enter>>\nType the config of pins at current position eg: IIXXI <<Enter>>\npress ctrl+D\n\n");
    process.stdin.resume();
    process.stdin.setEncoding('ascii');
    
    process.stdin.on('data', function (data) {
        input_stdin += data;
    });
    
    process.stdin.on('end', function () {
        input_stdin_array = input_stdin.split("\n");
        main();
    });
}

function readLine() {
    return input_stdin_array[input_currentline++];
}

/// Logic ///
let grundNums = [0, 1, 2]; // GrundNums based on Sprague Grundy Game Theory

/* PreComputing the probable game results */
function preCompute(n) {
    for (let i = 3; i <= n; i++) {
        let set = [];
        for (let j of [1, 2]) {
            for (let k = 0; k < Math.floor((i - j) / 2 + 1); k++) {
                set.push(grundNums[k] ^ grundNums[i - j - k])
            }
        }
        set = set.sort().filter(function (el, i, a) { if (i == a.indexOf(el)) return 1; return 0 });
        let minEx = 0;
        while (set.includes(minEx)) {
            minEx++;
        }
        grundNums.push(minEx);
    }
}

/* Deciding the winning chances based on precomputed array of results */
function isWinning(n, config) {
    // Return WIN or LOSE depending on whether you will win
    let result = 0;
    preCompute(n);
    for (let position of config.split("X")) {
        result ^= grundNums[position.length];
    }
    return result ? "WIN" : "LOSE"
}

function main() {
    let t = parseInt(readLine());
    for (let a0 = 0; a0 < t; a0++) {
        let n = parseInt(readLine());
        let config = readLine();
        let result = isWinning(n, config);
        process.stdout.write("Result: " + result + "\n");
    }
}
