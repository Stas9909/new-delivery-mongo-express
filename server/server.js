const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const server = express();
server.use(cors());
server.use(express.json());

// const url = process.env.MONGO_URL || 'mongodb+srv://stasprgiykhodko1:Hwsvg4KhDuJKOoKC@cluster0.rmymtql.mongodb.net/?retryWrites=true&w=majority'
const url = 'mongodb+srv://stasprykhodko1:Hwsvg4KhDuJKOoKC@cluster0.rmymtql.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let activeConnections = 0

// Функция для получения имен коллекций
async function getCollections(req, res) {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  const dbName = 'shop-goods';
  const db = client.db(dbName);

  try {
    activeConnections++
    client.connect();
    console.log(123321)
    const collections = await db
      .listCollections()
      .toArray();
    const collectionNames = collections.map(collection => collection.name);
    console.log(collections)
    res.status(200).json(collectionNames);
  } catch (error) {
    res.status(500).json({ message: 'Could not get collection names' });
    console.error(error)
  }
  finally {
    activeConnections--
    if (activeConnections === 0) {
      client.close();
    }
  }
}

// Функция для получения данных выбранной коллекции
async function getCollectionData(req, res) {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  const dbName = 'shop-goods';
  const db = client.db(dbName);

  const { collectionName } = req.params;
  try {
    activeConnections++//при каждом запросе увеличиваем счетчик активных соединений
    await client.connect();
    const data = await db
      .collection(collectionName)
      .find()
      .toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Could not get collection data' });
    return;
  }
  finally {
    activeConnections--//при каждом запросе уменьшаем счетчик активных соединений и если он равен 0, то закрываем соединение с базой данных
    if (activeConnections === 0) {
      client.close();
    }
  }
}

async function saveOrder(req, res) {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  const { name, email, phone, address, items, totalAmount } = req.body;
  const dbName = 'saved-food-orders';
  const db = client.db(dbName);

  try {
    activeConnections++
    await client.connect();
    const result = await db
      .collection('orderData')
      .insertOne({
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
  } finally {
    activeConnections--
    if (activeConnections === 0) {
      client.close();
    }
  }
}

// Маршрут для получения имен коллекций
server.get('/server/collections', getCollections);

// Маршрут для получения данных выбранной коллекции
server.get('/server/collections/:collectionName', getCollectionData);

server.post('/server/save-order', saveOrder);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));









