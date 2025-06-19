const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Second Brain Backend Running'));

app.use('/api/notes', notesRoutes);
app.use('/api/user', userRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/secondbrain-2', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
  app.listen(5000, () => console.log(`Server running on http://localhost:5000`));
}).catch(err => console.error('MongoDB Connection Error:', err));
