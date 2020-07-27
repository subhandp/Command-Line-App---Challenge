const { program } = require("@caporal/core")
const networkInterfaces = require('os').networkInterfaces();
const getPublicIP = require('external-ip')();
const cheerio = require('cheerio')
const axios = require('axios');

const lower = (text) => { return text.toLowerCase(); }
const upper = (text) => { return text.toUpperCase(); }
const obfuscate = (text) => { return text.split('').map((v, i) => '&#' + text.charCodeAt(i)).join(''); }

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

function capitalize(value) {
    let hasil = value
        .split(" ")
        .map((value) => value.toLowerCase().replace(value.charAt(0), value.charAt(0).toUpperCase()))
        .join(" ");
    return hasil;
}


module.exports = {
    palindrome,
    random,
    lower,
    upper,
    obfuscate,
    getPrivateIP,
    scrapeKompasHeadlines,
    capitalize
}