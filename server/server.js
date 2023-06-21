const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const server = express();
server.use(cors());
server.use(express.json());

const url = process.env.MONGO_URL || 'mongodb+srv://stasprykhodko1:Hwsvg4KhDuJKOoKC@cluster0.rmymtql.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
  } catch (error) {
    console.log('Failed to connect to MongoDB:', error);
  }
}

async function closeDatabaseConnection() {
  try {
    await client.close();
  } catch (error) {
    console.log('Failed to close MongoDB connection:', error);
  }
}

// Функция для получения имен коллекций
async function getCollections(req, res) {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  const dbName = 'shop-goods';
  const db = client.db(dbName);

  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    res.status(200).json(collectionNames);
  } catch (error) {
    res.status(500).json({ message: 'Could not get collection names' });
  }
}

// Функция для получения данных выбранной коллекции
async function getCollectionData(req, res) {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  const dbName = 'shop-goods';
  const db = client.db(dbName);

  const { collectionName } = req.params;
  try {
    const data = await db.collection(collectionName).find().toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Could not get collection data' });
  }
}

async function saveOrder(req, res) {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  const { name, email, phone, address, items, totalAmount } = req.body;
  const dbName = 'saved-food-orders';
  const db = client.db(dbName);

  try {
    const result = await db.collection('orderData').insertOne({
      name,
      email,
      phone,
      address,
      items,
      totalAmount,
      createdAt: new Date(),
    });
    res.status(200).json({ orderId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Could not save order' });
  }
}

// Маршрут для получения имен коллекций
server.get('/server/collections', getCollections);

// Маршрут для получения данных выбранной коллекции
server.get('/server/collections/:collectionName', getCollectionData);

server.post('/server/save-order', saveOrder);

const PORT = process.env.PORT || 10000;
const serverInstance = server.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

connectToDatabase();

process.on('beforeExit', async () => {
  await closeDatabaseConnection();
  serverInstance.close(() => {
    process.exit(0);//при выходе из приложения закрываем соединение с базой данных, т.е с кодом 0, который означает успешное завершение работы приложения
  });
});


