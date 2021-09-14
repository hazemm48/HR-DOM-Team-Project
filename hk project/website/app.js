document.addEventListener("DOMContentLoaded", getData());

/* Global Variables */
const myApi="ac48ae8af4dc29bf45004169c99ff139";
const generate = document.querySelector('#generate');
const save = document.querySelector('#save');
const countryError = document.querySelector('p');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

//generate button click listener
generate.addEventListener("click",url);
save.addEventListener("click",submitSave);

//sending url data function 
function url (){
    const country = document.getElementById('country').value;
    const mainUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${myApi}&units=metric`;
    if(/\S/.test(country)){
     postData (mainUrl);
     countryError.innerText=''
    }else{
      countryError.innerText='* fill this field *'
  }
}

 //function to get data from the api and send to server
async function postData (url) {
    try{
 const res = await fetch(url);
 const data = await res.json();
 const temp = data.main.temp;
 const humidity = data.main.humidity;

 await fetch('setWeather',{
     method: 'POST',
     credentials: 'same-origin',
     headers: {'content-type': 'application/json'},
     body: JSON.stringify({
         date: newDate,
         temp: temp,
         hum: humidity
    }) 
  })
  updateUI(); 
  countryError.innerText=''
  }catch(error){
    countryError.innerText='* Write a valid country name *'
   }
 }

  //function to get weather data from the server and send to client side
  const updateUI = async () => {
    const request = await fetch('/getWeather');
    try{
      const allData = await request.json();
      console.log(allData);
      document.getElementById('date').innerHTML =`Date: ${allData.date}`;
      document.getElementById('temp').innerHTML = `Temperature: ${allData.temp}`;
      document.getElementById('hum').innerHTML =`Humidity: ${allData.hum}`;

     /* if(allData.temp >= 10){
        document.querySelector('body').style.backgroundImage='url(pics/bgh.jpg)';
      }*/
      
    }catch(error){
      console.log("error", error);
    }
  }

  //function to save data to localStorage
  async function submitSave (){
    const request = await fetch('/getWeather');
    try{
      const allData = await request.json();
      const country = document.getElementById('country').value;
      let data={
      date:allData.date,
      temp:allData.temp,
      hum:allData.hum
    }
    console.log(data)
    let finalData=JSON.stringify(data);
    if(/\S/.test(country)){
    localStorage.setItem(country,finalData)
    location.reload();
    getData();
    }
      }catch(error){
        console.log("error", error);
      }
  };

  //function to get data from localStorage
  function getData(){
    let ResultTable=document.querySelector("#tbody");
    ResultTable.innerHTML = '';
    for (let i=0;i<localStorage.length;i++){
    let country = localStorage.key(i);
    let value = localStorage.getItem(country);
    let finalData = JSON.parse(value);
    console.log(finalData)
    let htmlTextToAdd =
    `<tr><th scope="row">${country}</th>
    <td>${finalData.temp}</td>
    <td>${finalData.hum}</td>
    <td>${finalData.date}</td>
    <td><button id="remove" type = "submit"></button></td></tr>`;
    ResultTable.insertAdjacentHTML('afterbegin', htmlTextToAdd);
    document.getElementById('remove').addEventListener('click',deleteRow);
    document.querySelector('.table').style.visibility='visible';
    }
  }

  //function to delete the data from the row and localStorage
 function deleteRow(event) {
   const eventCountry=event.target.closest('tr').firstElementChild.innerText;
   console.log(eventCountry)
   for (let i=0;i<localStorage.length;i++){
    let country = localStorage.key(i);
    if(country==eventCountry){
    localStorage.removeItem(country)
    location.reload() }
   }  
 }
