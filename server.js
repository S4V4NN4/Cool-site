const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const connectionString = 'mongodb://localhost:27017';
const dbName = 'usersdb';

app.use(express.json());
app.use(express.static(__dirname)); 


app.post('/submit-to-mongo', async (req, res) => {

    const userData = req.body;
    console.log('Получены данные для MongoDB:', userData);

    if (!userData.email || !userData.password) {
        return res.status(400).json({ success: false, message: 'Email и пароль обязательны!' });
    }

    const client = new MongoClient(connectionString);
    try {
        await client.connect();
        const db = client.db(dbName);
        
        const collection = db.collection('users'); 

        await collection.insertOne(userData);

        res.status(201).json({ success: true, message: 'Данные успешно сохранены в MongoDB!' });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ success: false, message: 'Ошибка на сервере.' });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен. Откройте http://localhost:${port}/feed.html в браузере.`); 
});