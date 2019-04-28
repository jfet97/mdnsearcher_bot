const Telegraf = require('telegraf');
const { MDNSearchScraper } = require('./scraper/MDNSearchScraper.js');
const { AnswerGenerator } = require('./answerGenerator/answerGenerator.js');

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {

    const scraper = new MDNSearchScraper();
    await scraper.init(inlineQuery.query);

    // array of {title, url, description}
    const results = scraper.getNResults(5);

    const answerGenerator = new AnswerGenerator(results);
    const answers = answerGenerator.generateInlineAnswers();

    return answerInlineQuery(answers);
});


// long polling
bot.launch();

// ignores errors
bot.catch(() => { });

