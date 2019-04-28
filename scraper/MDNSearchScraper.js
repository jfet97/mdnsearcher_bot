const rp = require('request-promise');
const { JSDOM } = require("jsdom");

const searchResultsMap = {
    RESULTS_LIST_ITEM: ".result-list-item",
    HEADING: "h4",
    TITLE: 'a',
    DESCRIPTION: 'p:first-of-type',
};

const resultsFieldsMap = {
    url: 'url',
    title: 'title',
    description: 'description',
}

module.exports.resultsFieldsMap = resultsFieldsMap;

module.exports.MDNSearchScraper = class {

    async init(query) {
        try {
 
            const html = await rp(`https://developer.mozilla.org/en-US/search?q=${query}`);

            const { document } = (new JSDOM(html)).window;
            this._document = document;
            return;

        } catch (e) {
            return this.init(query);
        }
    }

    getNResults(n = 1) {
        const titles = this._getNTitles(n);
        const descriptions = this._getNDescriptions(n);

        return Array.from({ length: n }).map((_, i) => ({
            ...titles[i],
            ...descriptions[i],
        }));
    }

    _getNTitles(n = 1) {
        const queryString = `${searchResultsMap.RESULTS_LIST_ITEM} > ${searchResultsMap.HEADING} > ${searchResultsMap.TITLE}`;

        const rawTitlesList = this._document.querySelectorAll(queryString);
        const rawTitleArray = Array.from(rawTitlesList).slice(0, n);

        const titleArray = rawTitleArray.map((rawTitle => ({
            [resultsFieldsMap.url]: rawTitle.href,
            [resultsFieldsMap.title]: rawTitle.textContent
        })));

        return titleArray;
    }

    _getNDescriptions(n = 1) {
        const queryString = `${searchResultsMap.RESULTS_LIST_ITEM} > ${searchResultsMap.DESCRIPTION}`;

        const rawDescriptionsList = this._document.querySelectorAll(queryString);
        const rawDescriptionsArray = Array.from(rawDescriptionsList).slice(0, n);

        const descriptionsArray = rawDescriptionsArray.map((rawDesc) => ({
            [resultsFieldsMap.description]: truncate(rawDesc.textContent),
        }));

        return descriptionsArray;
    }
};

function truncate(str, maxCharacters = 70, ending = '...') {

    let ellipsedString = "";

    if (str.length > maxCharacters) {
        ellipsedString += str.substring(0, maxCharacters - ending.length).trim() + ending;
    } else {
        ellipsedString += str;
    }

    return ellipsedString;
};