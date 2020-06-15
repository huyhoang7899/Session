const express = require('express');
var cookieParser = require('cookie-parser');
const port = 3000;

var userRouter = require('./routers/user.router');
var bookRouter = require('./routers/book.router');
var transactionRouter = require('./routers/transaction.router');
// var middlewareCookie = require("./middlewares/cookie.middleware");
var authRouter = require('./routers/auth.router');
var profileRouter = require('./routers/profile.router');
var authMiddleware = require('./middlewares/auth.middleware');
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser('qGMCswAGm7ai6Xpp9STG'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', authMiddleware.requireAuth, function(req, res) {
   res.render('index');
});

// app.use(middlewareCookie.cookie);
app.use('/users', authMiddleware.requireAuth, userRouter);
app.use('/books', authMiddleware.requireAuth, bookRouter);
app.use('/transactions', authMiddleware.requireAuth, transactionRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
