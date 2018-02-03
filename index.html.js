const googleAnalyticsId = process.env.GA_ID ? `window.GA_ID = ${process.env.GA_ID};` : '';

const getHTML = (abeUrl, isDev) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABE | Olin College Library</title>
</head>
<body>
<div id="app"></div>
<script type="text/javascript">
    window.abe_url = "${abeUrl}";
    window.debug = ${isDev.toString()};
    ${googleAnalyticsId}
</script>
<script src="/bundle.js" type="text/javascript"></script>
<link rel="stylesheet" href="/node_modules/input-moment/dist/input-moment.css"/>
<link rel="stylesheet" type="text/css" href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
<link rel='stylesheet' href='/public/css/app.css'/>
</body>
</html>`
};

module.exports = getHTML;
