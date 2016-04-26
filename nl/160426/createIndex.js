var fs = require('fs');

var index = fs.readFileSync('index.tpl.html', 'utf-8'),
    starData = fs.readFileSync('data.json', 'utf-8');

index = index.replace('{{data}}', starData);
fs.writeFileSync('index.html', index);
