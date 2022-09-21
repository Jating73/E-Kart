const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Error handling Middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// All routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

dotenv.config();

connectDB();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

__dirname =  path.resolve()
console.log(__dirname);
console.log(path.join(__dirname, '/frontend/build'))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running fine....')
  })
}

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is listening in ${process.env.NODE_ENV} mode on ${PORT}`);
});