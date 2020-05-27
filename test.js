let bolt = require('./dist/index.js');
let app = new bolt();

app.get('/user/:name', function(req) {
    console.log('GET', req.headers['user-agent'])
    console.log(`Hello, ${req.vars.name}!!`);
})

app.get('*', function(req) {
    console.log(req.url);
})

app.listen(80);