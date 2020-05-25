//3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Required middleware and modules
const notFound = require('./middleware/404');
const errorHandler = require('./middleware/500');

//Require Routes
const downloadRouter = require('./routes/downloadRouter');
const authRouter = require('./routes/auth');
const app = express();


//Run Middlewate
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.use('/download', downloadRouter);
app.use(authRouter);

//Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (PORT) => {
    app.listen(PORT, "192.168.0.41", () => {
      console.log(`🍻 I know that you came to party baby, baby, baby, baby on port ${PORT} 🍻`);
    });
  },
};