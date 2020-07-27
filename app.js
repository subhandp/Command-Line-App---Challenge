const { program } = require("@caporal/core")
const networkInterfaces = require('os').networkInterfaces();
const getPublicIP = require('external-ip')();
const cheerio = require('cheerio')
const axios = require('axios');
XLSX = require('xlsx');



async function scrapeKompasHeadlines() {
    const html = await axios.get('https://indeks.kompas.com/headline');
    const $ = await cheerio.load(html.data);
    let data = [];

    $('.article__list').each((i, elem) => {
        data.push({
            title: $(elem).find('h3.article__title a').text(),
            link: $(elem).find('a.article__link').attr('href')
        })

    });

    data.map((v, i) => {
        console.log('Title: ' + v.title);
        console.log('Link: ' + v.link);

    })
}


function getPrivateIP() {
    let address;
    Object.keys(networkInterfaces).forEach(dev => {
        networkInterfaces[dev].filter(details => {
            if (details.family === 'IPv4' && details.internal === false) {
                address = details.address;
            }
        });
    });

    return address
}

const lower = (text) => { return text.toLowerCase(); }
const upper = (text) => { return text.toUpperCase(); }
const obfuscate = (text) => { return text.split('').map((v, i) => '&#' + text.charCodeAt(i)).join(''); }

function random(len, capital, type) {
    let str = '';
    const typeRandom = {
        alphanumeric: "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        letters: "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789"
    }
    for (let i = 0; i < len; i++) {
        str += typeRandom[type][(Math.floor(Math.random() * typeRandom[type].length))]
    }
    if (capital == 'uppercase')
        return str.toUpperCase();
    else if (capital == 'lowercase')
        return str.toLowerCase();
    else
        return str;
}


function palindrome(str) {
    const text = str.replace(/\W/gi, "").toLowerCase()
    const reverseText = text.split("").reverse().join("")
    return (text === reverseText) === true ? 'Yes' : 'No';
}

program

    .command("lowercase", "lowercase text")
    .argument("<text>", "Text to lowercase")
    .action(({ logger, args, options }) => {
        logger.info(lower(args.text));
    })

.command("uppercase", "uppercase text")
    .argument("<text>", "Text to uppercase")
    .action(({ logger, args, options }) => {
        logger.info(upper(args.text));
    })

.command("obfuscate", "obfuscator")
    .argument("<text>", "Obfuscator text to  unicode")
    .action(({ logger, args, options }) => {
        logger.info(obfuscate(args.text));
    })

.command("random", "Random string") //app.js random --numbers false --uppercase --length-str 20
    .option("--length-str <option>", "Length of random string", {
        default: 32,
        validator: program.NUMBER
    })
    .option("--letters <option>", "Random dont generate letters")
    .option("--numbers <option>", "Random dont generate numbers")
    .option("--uppercase <option>", "Random text convert to Uppercase")
    .option("--lowercase <option>", "Random text convert to Lowercase")
    .action(({ logger, args, options }) => {
        let capital, type = 'alphanumeric';
        if (options.letters == false) {
            type = 'numbers';
        } else if (options.numbers == false) {
            type = 'letters';
        } else {
            type = 'alphanumeric';
        }

        if (options.uppercase) {
            capital = 'uppercase';
        } else if (options.lowercase) {
            capital = 'lowercase';
        }

        logger.info(random(options.lengthStr, capital, type));

    })

.command('add', 'add numbers')
    .argument("<numbers...>", "add numbers")
    .action(({ logger, args, options }) => {
        logger.info(args.numbers.reduce((p, c) => p + c));
    })

.command('substract', 'substract numbers')
    .argument("<numbers...>", "substrack numbers")
    .action(({ logger, args, options }) => {
        logger.info(args.numbers.reduce((p, c) => p - c));
    })

.command('multiply', 'multiply numbers')
    .argument("<numbers...>", "multiply numbers")
    .action(({ logger, args, options }) => {
        logger.info(args.numbers.reduce((p, c) => p * c));
    })

.command('divide', 'divide numbers')
    .argument("<numbers...>", "divide numbers")
    .action(({ logger, args, options }) => {
        logger.info(args.numbers.reduce((p, c) => p / c));
    })

.command('palindrome', 'Palindrome')
    .argument("<string>", "check palindrome string")
    .action(({ logger, args, options }) => {
        logger.info("String: " + args.string);
        logger.info("Is palindrome: " + palindrome(args.string));

    })

.command('ip', 'Private ip addres')
    .action(({ logger }) => {
        logger.info(getPrivateIP());

    })

.command('ip-external', 'Public ip addres')
    .action(({ logger }) => {
        getPublicIP((err, ip) => { console.log(ip); });
    })

.command('headlines', 'Headlines Kompas.com')
    .action(({ logger }) => {
        scrapeKompasHeadlines();
    })

.command('convert', 'Convert XLSX/XLS/CSV')
    .argument("<fileone>", "file to convert")
    .argument("<filetwo>", "file convert result")
    .action(({ logger, args, options }) => {
        let splitFileTwo = args.filetwo.split('.');
        const workBook = XLSX.readFile(args.fileone);
        XLSX.writeFile(workBook, args.filetwo, { bookType: splitFileTwo[1] });
    })
program.run()