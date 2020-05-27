## ⚡Bolt⚡
A lighting fast and lightweight web application framework for Node.JS!

```javascript
let bolt = require('jsbolt');
let app = new bolt();

app.get('/user/:name', function(req) {
    console.log(req.params.name)
});

app.listen(8000);
```