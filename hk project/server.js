// Setup empty JS object to act as endpoint for all routes
projectData = {};
 
// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');

// Start up an instance of app
const app=express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/**
 * body parser is now deprecated from express v4.16+ so, we could use express.json() instead
 **/

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port=8000;
const server = app.listen(port,()=>{
    console.log("server running")
})

app.get('/getWeather',(req,res)=>{
    res.send(projectData)
  })

app.post('/setWeather',(req,res)=>{
      projectData.temp = req.body.temp;
      projectData.date = req.body.date;
      projectData.hum = req.body.hum;
      res.end()
  })