const genres = {
    latest: null,
    music: 30,
    rockstar: 43,
    tips: 121,
    gtav: 702,
    updates: 705,
    fanvideos: 706,
    fanart: 708,
    creator: 728,
    rdr2: 736,
};
const puppeteer = require('puppeteer');
const request = require('got');
const fs = require('fs');
const newsDir = './newswire.json';
const mainLink = 'https://graph.rockstargames.com/';
const refreshInterval = 7.2e+6; // 2 hours in milliseconds. If you would like to change it (http://www.unitconversion.org/time/seconds-to-milliseconds-conversion.html)
let articles, newsHash;

fs.readFile(newsDir, 'utf8', (err, jsonString) => {
    articles = jsonString ? JSON.parse(jsonString) : {};
});

class newswire {
    constructor(genre, webhook) {
        if (typeof genres[genre] == 'undefined') return console.log('Invalid genre. Available genres:' + Object.keys(genres).map(gen => ' ' + gen));
        this.genre = genre;
        this.genreID = genres[genre];
        this.webhook = webhook;
        this.main();
    }

    async main() {
        let article;
        console.log('[READY] Started news feed for ' + this.genre + '. Feed refreshes every 2 hours.');
        newsHash = await getHashToken();
        article = await this.getNewArticle();
        if (!(article instanceof TypeError) && article.title) {
            this.sendArticle(article)
        }
        setInterval(async _ => {
            console.log('[REFRESH] Refreshing news feed for ' + this.genre);
            article = await this.getNewArticle();
            !(article instanceof TypeError) && article.title ? this.sendArticle(article) : console.log(article.message);
        }, refreshInterval);
    }

    sendArticle(article) {
        console.log(`[NEW] ${this.genre}: ${article.title} (${article.link})`);
        article.tags = '' + article.tags.map(tag => '`' + tag + '` ');
        const embed = {
            'embeds': [{
                'author': {
                    'name': 'Rockstar Newswire',
                    'url': 'https://www.rockstargames.com/newswire',
                    'icon_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/1200px-Rockstar_Games_Logo.svg.png'
                },
                'title': article.title,
                'url': article.link,
                'color': 15258703,
                'fields': [],
                'image': {
                    'url': article.img
                },
                'footer': {
                    "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/1200px-Rockstar_Games_Logo.svg.png",
                    "text": article.date
                }
            }]
        };
        request.post(this.webhook, {
            body: JSON.stringify(embed),
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    async getNewArticle() {
        console.log('[CHECK] Checking for new articles in ' + this.genre);
        return this.processRequest().then(async (res) => {
            if (res && res.errors != null) {
                if (res.data == null && res.errors[0].message == 'PersistedQueryNotFound') {
                    console.log('[HASH] Token has expired, generating new one.');
                    newsHash = await getHashToken().catch(console.log);
                    res = await this.processRequest().catch(console.log);
                } else {
                    return new TypeError('[ERROR] Rockstar API couldn\'t retrieve articles.');
                }
            }
            let article = res.data.posts.results[0];
            let check = await checkArticleExists(article.id);
            if (!check) {
                let tags = [];
                article.url = 'https://www.rockstargames.com' + article.url;
                await article.primary_tags.map(tag => tags.push(tag.name))
                addArticle(article.id.toString(), article.url);
                return {
                    title: article.title,
                    link: article.url,
                    img: article['preview_images_parsed']['newswire_block']['d16x9'],
                    date: article.created,
                    tags: tags
                }
            } else {
                return new TypeError('[CHECK] No new articles found for ' + this.genre)
            }
        }).catch(console.log);
    }

    async processRequest() {
        return new Promise(async (resolve, reject) => {
            const searchParams = new URLSearchParams([
                ['operationName', 'NewswireList'],
                ['variables', JSON.stringify({
                    page: 1,
                    tagId: this.genreID,
                    metaUrl: '/newswire',
                    locale: 'en_us'
                })],
                ['extensions', JSON.stringify({
                    persistedQuery: {
                        version: 1,
                        sha256Hash: newsHash
                    }
                })]
            ]);
            const response = await request.post(mainLink, {
                searchParams: searchParams,
                json: true
            }).catch(reject);
            resolve(JSON.parse(response.body));
        });
    }
}

function addArticle(article, url) {
    if (articles) {
        if (!articles[article]) {
            articles[article] = url;
            fs.writeFile(newsDir, JSON.stringify(articles, null, 2), (err) => {
                if (err) console.log('Failed to save articles to db due ' + err);
            });
        } else {
            console.log('Article ID: ' + article + ' already exists in database.');
        }
    }
}

async function getHashToken() {
    return new Promise(async (res, rej) => {
        try {
            const browser = await puppeteer.launch({
                headless: true
            });
            const page = await browser.newPage();
            await page.setRequestInterception(true);
            page.on('request', interceptedRequest => {
                if (interceptedRequest.url().includes('operationName=NewswireList')) {
                    let url = interceptedRequest.url();
                    let params = url.split('?')[1];
                    let query = new URLSearchParams(params);
                    let hash = '';
                    for (let pair of query.entries()) {
                        if (pair[0] == 'extensions' && pair[1]) {
                            hash = JSON.parse(pair[1])['persistedQuery']['sha256Hash'];
                            interceptedRequest.abort();
                            browser.close();
                            console.log(hash);
                            res(hash);
                        }
                    }
                } else {
                    interceptedRequest.continue();
                }
            });
            page.goto('https://www.rockstargames.com/newswire');
        } catch (e) {
            rej(e.stack);
        }
    });
};

function checkArticleExists(articleID) {
    return (articles && articles[articleID]);
}

module.exports = newswire;