const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb+srv://kunalsrvs:99Jok84AQWcBr4uk@cluster0.u9fwbeh.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


const weatherSchema = new mongoose.Schema({
  location: String,
  temperature: Number,
  humidity: Number,

});

const Weather = mongoose.model('Weather', weatherSchema);


app.use(express.static(path.join(__dirname)));


app.use(express.json());


app.post('/api/weather', async (req, res) => {
  try {
    const { location } = req.body;

   
    const apiKey = 'd652a6f740150e546457a6b163b84666';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${location}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    const weatherData = response.data;

   
    const newWeather = new Weather({
      location: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      
    });

    await newWeather.save();

    res.status(201).json({ message: 'Weather data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/weather/:location', async (req, res) => {
  try {
    const location = req.params.location;
    const weather = await Weather.findOne({ location });

    if (!weather) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    res.json(weather);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/weather/:location', async (req, res) => {
    try {
      const location = req.params.location;
      const updatedData = req.body;
  
      const weather = await Weather.findOneAndUpdate({ location }, updatedData, { new: true });
  
      if (!weather) {
        return res.status(404).json({ error: 'Weather data not found' });
      }
  
      res.json(weather);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.delete('/api/weather/:location', async (req, res) => {
  try {
    const location = req.params.location;

    const weather = await Weather.findOneAndDelete({ location });

    if (!weather) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    res.json({ message: 'Weather data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
