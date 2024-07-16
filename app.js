const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute');
const ratingRoute = require('./routes/ratingRoute');
const protectedRoute = require('./routes/protectedRoute');
const cookieParser = require('cookie-parser');
const i18n = require('./config/i18-config');
const morgan = require('morgan');
const helmet = require("helmet");
const rateLimiter = require('./middlewares/rateLimiter');
const { successHandler, errorHandler } = require('./middlewares/responseHandler');
const router = express.Router();

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(i18n.init);

// Connect to MongoDB
connectDB();
 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Apply success handler middleware
app.use(successHandler);

// Apply rate limiter middleware
app.use(rateLimiter);

// Middleware to set locale from cookie
app.use((req, res, next) => {
  const locale = req.query.lang || req.cookies.locale || req.headers['accept-language'];
  if (locale) {
    res.setLocale(locale);
  }
  next();
});
// Routes
app.use('/api/auth', authRoute); 
app.use('/api/product', productRoute);
app.use('/api/order', orderRoute);
app.use('/api/rating', ratingRoute); 
app.use('/api/auth', protectedRoute);

app.get('/get-started', (req, res) => {
  res.json({ message: res.__('welcome_message') });
});

app.get('*', (req, res) => {
    res.status(404).send("<h1>The page you are looking for is not found</h1>");
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, (error) => {
    if (!error) 
        console.log(`Server running at http://localhost:${port}`);
    else 
        console.log("Error occurred, server can't start", error);
});








// const passport = require('passport');
// const session = require('express-session');
// const path = require('path');
//  require('./config/passport');


// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// 
// app.use(session({ 
//   secret: 'mysecret',
//    resave: false,
//     saveUninitialized: false
//    }));
//    
// app.use(passport.initialize());
// app.use(passport.session());


// app.get('/auth/google', passport.authenticate('google', { scope: ['email','profile'] }));
// 
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/dashboard');
//   });
// 
// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });
// 
// const isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) return next();
//   res.redirect('/');
// };
// 
// app.get('/', (req, res) => {
//   res.render('index', { user: req.user });
// });
// 
// app.get('/dashboard', isLoggedIn, (req, res) => {
//   res.render('dashboard', { user: req.user });
// });
