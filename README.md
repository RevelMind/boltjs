## ⚡Bolt⚡
A lighting fast and lightweight web application framework for Node.JS!

## WARNING: BOLT IS UNFINISHED!!

### Example Application
```javascript
let bolt = require('jsbolt');
let app = new bolt();

app.get('/user/:name', function(req) {
    console.log(req.params.name)
});

app.listen(8000);
```

With this app, whenever you go to `localhost:8000/user/random_user` it will log `random_user` to the console.