let bolt = require('./dist/index.js');
let app = new bolt();

app.get('/:test', function(req) {
    
})

app.get('*', function(req) {
    console.log(req.url);
})

app.listen(8000);