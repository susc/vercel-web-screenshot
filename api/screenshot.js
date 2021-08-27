const puppeteer = require('puppeteer')
const chrome = require('chrome-aws-lambda')

async function main(req, res) {
    // 检查是否提供URL
    let targetUrl = req.query?.url
    if (!targetUrl) {
        console.error('Missing target URL')
        return res.status(400).send('请提供一个URL')
    }
    console.log(`Got target URL: ${targetUrl}`)
    
    // 检查URL是否合法
    let validationResult = /^https?:\/\/([^\.]+\.)+\w{2,}($|\/\S*$)/ig.exec(targetUrl)
    if (!validationResult) {
        console.error('The URL is invalid: ' + targetUrl)
        return res.status(400).send('您提供的URL不合法')
    }

    // 加载字体，防止中文字符显示为方块
    await chrome.font('https://web-screenshot.vercel.app/assets/fonts/simhei.ttf')

    // 开始截图
    const browser = await puppeteer.launch({
        args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()
    await page.goto(targetUrl)
    let img = await page.screenshot({
        type: 'jpeg',
        fullPage: true
    })
    await browser.close()

    // 响应截图
    res.setHeader('Content-Type', 'image/jpeg')
    res.send(img)
}

module.exports = main