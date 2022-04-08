const path = require('path');
const express = require('express');
const hbs = require('hbs')
const geocode = require("./utils/geocode"); 
const weather = require("./utils/weather"); 

const app = express();

// Configurations
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.set('view engine', 'hbs');

// Routes
app.get('', (req, res) => {
  res.render("index");
})

app.get('/weather', (req, res) => {
  const address = req.query.address;
  const weatherResponse = {
    address: address
  };

  geocode(address, (error, coords) => {
    if (error) {
      weatherResponse.error = error;
      return res.send(weatherResponse);
    }  else {
      weather(coords.lon, coords.lat, (error, data) => {
        if (error)  {
          weatherResponse.error = error;
        } else {
          console.log(data);
          weatherResponse.country_tag = data.sys.country;
          weatherResponse.area = data.name;
          weatherResponse.status = data.weather[0].description;
          weatherResponse.temprature = data.main.temp;
          weatherResponse.humidity = data.main.humidity;
          weatherResponse.visibility = +data.visibility/1000;
          
        }
        return res.send(weatherResponse);
      })
    }
  });

});

app.listen(3000)
// const cityName = process.argv[2];

// if (cityName) {
//   geocode(cityName, (error, {lon, lat}) => {
//     if (error) {
//       console.log(error);
//     }  else {
//       weather(lon, lat, (error, data) => {
//         if (error)  {
//           console.log(error);
//         } else {
//           console.log(`Status: ${data.weather[0].description}`);
//           console.log(`Temprature: ${data.main.temp}C`);
//           console.log(`Humidity: ${data.main.humidity}%`);
//           console.log(`Visibility: ${+data.visibility/1000}km`);
//         }
//       })
//     }
//   });
// } else {
//   console.log("Please give city name as argument.");
// }