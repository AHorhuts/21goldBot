const {Telegraf, Markup} = require('telegraf');
require('dotenv').config();
const pool = require('./dbConfig')
const {uploadFile} = require('telegraf')



pool.connect((err) => {
    if (err) {
        return console.error( 'connection error!',err.stack)
    } else {
        console.log("connected!")
    }
});

let query = "SELECT * FROM cardstg"

pool.query (query, (err, result, fields) => {
    // console.log(err);
    // console.log(result);
    pool.end((err) => {
        console.log('db disconnected')
        if (err) {
            console.log('error while disconnect!')
        }
    })
});



// BOt creation
const bot = new Telegraf(process.env.BOT_TOKEN);
const logo21G = "21goldLogoLast.png"

// Команда старт, приветствие+лого+ кнопки выбора акки/карты
bot.command("start", (ctx) => {
    ctx.replyWithPhoto({
        source: logo21G
    })
    ctx.reply(" Добро пожаловать в бота по выдаче акков и карт от 21GOLD!", Markup.keyboard(['Получить аккаунты 👥', "Получить карты 💳"]))
})

//Развитие "Получить карты 💳" - Выбор карты
// bot.hears('Получить карты 💳',(ctx) => {
//     let query = 'SELECT * FROM availableCards WHERE isUsed = F;'
//     client.query (query, (err, result, fields) => {
//         console.log(err);
//         console.log(result);
//         client.end((err) => {
//             console.log('db disconnected')
//             if (err) {
//                 console.log('error while disconnect!')
//             }
//         })
//     });
//     ctx.reply()
// })


// Развитие 'Получить акки' - Выбор вида аккаунта
bot.hears('Получить аккаунты 👥', (ctx) => {
    ctx.reply("Вид акка", Markup.keyboard(['enot', 'Avtoregs']))
})

// Запрос количества нужных акков Logs
bot.hears('enot', async(ctx) => {
    await ctx.reply('Введите нужное количество (максимум 10)')
    bot.on('message', async (ctx) => {
        let num_of_files = ctx.message.text;
        if(isNaN(num_of_files) || num_of_files !== 1 && num_of_files < 11) {
            for (let i = 1; i <= num_of_files; i++) {
                await ctx.replyWithDocument({source: `./uploads/${i}logs.txt`})
            }
        }
        else {
            return ctx.reply('Ошибка, отправь нужное количество аккаунтов (от 1 до 10)')
        }
        
    })
})
 
// загрузка новых файлов
bot.command('upload', (ctx) => {
    if (ctx.message.from.username === 'SGorguts') {
        ctx.reply ('Отправьте нужные файлы')
    }
    else {
        ctx.reply('Ошибка доступа!')
    }
    bot.on('document', uploadFile((ctx, next) => {
        ctx.reply(`File ${ctx.message.document.file_name} has been successfully uploaded`)
    }))
})


bot.launch().then(() => {
    console.log('Бот запущен')
})

process.once("SIGINT",() => bot.stop("SIGINT"));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


