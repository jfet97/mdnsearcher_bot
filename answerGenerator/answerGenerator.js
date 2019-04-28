const { resultsFieldsMap } = require('../scraper/MDNSearchScraper');

const inlineQueryResultArticle = {
    inlineQueryResultArticleTYPE: 'article',
    type: 'type',
    id: 'id',
    title: 'title',
    input_message_content: 'input_message_content',
    input_message_content___message_text: 'message_text',
    description: 'description',
    url: 'url',
}

module.exports.AnswerGenerator = class {
    constructor(rawAnswers) {
        this._rawAnswers = rawAnswers;
    }

    generateInlineAnswers() {
        return this._rawAnswers.map((res, i) => ({
            [inlineQueryResultArticle.type]: inlineQueryResultArticle.inlineQueryResultArticleTYPE,
            [inlineQueryResultArticle.id]: i,
            [inlineQueryResultArticle.title]: res[resultsFieldsMap.title],
            [inlineQueryResultArticle.input_message_content]: {
                [inlineQueryResultArticle.input_message_content___message_text]: res[resultsFieldsMap.url],
            },
            [inlineQueryResultArticle.description]: res[resultsFieldsMap.description],
            [inlineQueryResultArticle.url]: res[resultsFieldsMap.url],
        }));
    }
}