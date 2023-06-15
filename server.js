const express = require('express');
const mongoose = require('mongoose');
const shopRoutes = require('./BE/routes/shop-routes');
const userRoutes = require('./BE/routes/user-routes');
const cors = require('cors');
const socketIO = require('socket.io'); // Importujte socket.io

const app = express();
const port = 3001;
app.use(cors({ origin: 'http://localhost:3000' }));

// Připojení k MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Chyba připojení k MongoDB:'));
db.once('open', () => {
  console.log('Připojení k MongoDB bylo úspěšné');
});

// Definice rout a middleware

// Middleware pro parsování JSON dat
app.use(express.json());

app.use('/shop', shopRoutes);
app.use('/users', userRoutes);

// Handle React routing
app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Spuštění serveru
app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
});
