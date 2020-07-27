const { program } = require("@caporal/core")
const getPublicIP = require('external-ip')();
XLSX = require('xlsx');
const { palindrome, random, lower, upper, obfuscate, getPrivateIP, scrapeKompasHeadlines, capitalize } = require("./modules.js")


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

.command("capitalize", "Capitalize text")
    .argument("<text>", "Text to capitalize")
    .action(({ logger, args, options }) => {
        logger.info(capitalize(args.text));
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