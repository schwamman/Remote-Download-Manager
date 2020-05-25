//3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Require Routes
const downloadRouter = require('./downloadRouter');
const app = express();


//Run Middlewate
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.use('/download', downloadRouter);

module.exports = {
  server: app,
  start: (PORT) => {
    app.listen(PORT, "192.168.0.41", () => {
      console.log(`🍻 I know that you came to party baby, baby, baby, baby on port ${PORT} 🍻`);
    });
  },
};