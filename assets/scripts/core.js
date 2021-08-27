document.getElementById('startBtn').addEventListener('click', function(ev) {
    let targetUrl = document.getElementById('urlInput').value
    let validationResult = /^https?:\/\/([^\.]+\.)+\w{2,}($|\/\S*$)/ig.exec(targetUrl)
    if (!validationResult) {
        return alert('请输入一个正确的URL！\n例如：https://www.baidu.com')
    }
    window.location.href = '/api/screenshot?url=' + encodeURIComponent(targetUrl)
})