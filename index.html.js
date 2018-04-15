const getHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABE | Olin College Library</title>
</head>
<body>
<div id="app"></div>
<script src="/public/build/bundle.js" type="text/javascript"></script>
<link rel="stylesheet" href="/node_modules/input-moment/dist/input-moment.css"/>
<link rel="stylesheet" type="text/css" href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
<link rel='stylesheet' href='/public/css/app.css'/>
</body>
</html>`;
}

module.exports = getHTML;
