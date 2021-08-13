const Chroma = require("razer-chroma-nodejs");
const chalk = require('chalk');
const axios = require('axios');

const SUCCESS = chalk.hex('#43B581');
const INFO = chalk.hex('#FF73FA');
const LOG = chalk.hex('#44DDBF');

const config = require('./forum.json');

console.log(LOG(`Скрипт запущен. Начал прослушивание темы, которая находится на ${config.thread}`));

posts2(config)

function posts2(config) {
    // Получаем количество ответов в начале скрипта
    axios.get(`https://streamcraft.net/api/forum/discussion/${config.thread}?page=1`).then(response => {
        const posts_original = response.data.posts.total
        console.log(INFO(`Запрос отправлен! Запоминаю ${posts_original} ответов`));
        // Запускаем функцию, которая будет следить за новыми ответами
        threadinfo(config, posts_original)
    });
}

function green() {
    Chroma.util.init(() => {
        console.log(SUCCESS(`Новый ответ в вашей теме! Включаю подсветку.`));

        // Включение подсветки зелёным цветом. Если захотите изменить цвет, поменяйте GREEN на любой другой.
        const keyboardEffect = Chroma.effects.keyboard.setColor(Chroma.colors.GREEN);

        setTimeout(() => {
            Chroma.util.uninit(() => {
                console.log("Скрипт завершил свою работу.");
            });
        }, 3000);
    });
}

function threadinfo(config, posts_original) {
    // Получаем текущее количество ответов в теме
    axios.get(`https://streamcraft.net/api/forum/discussion/${config.thread}?page=1`).then((response) => {
        const posts3 = response.data.posts.total
        console.log(INFO(`Запрос отправлен! Текущее количество ответов: ${posts3} В начале запуска скрипта было: ${posts_original}`));
        if (posts3 == posts_original) {
            // Ответов новых не было замечено, скрипт повторит поиск через 30 секунд
            setTimeout(threadinfo, 30000, config, posts_original);
        } else {
            // Был замечен новый ответ, а значит запускаем функцию подсветки
            green();
        }
    });
}