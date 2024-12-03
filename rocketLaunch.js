const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";
const proxyUrl = 'https://corsproxy.io/';

fetchLaunches(proxyUrl, jsonRocketLaunches)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    async function fetchLaunches(proxyUrl, url) {
        try {
            const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            // console.log(data);
    
            processLaunches(data);
            setDateToLaunch(data);
        } catch (error) {
            console.error('Error fetching launches:', error);
        }
    }

    function processLaunches(data) {
        // console.log(data);
        const Data = document.getElementById('data');
        // if (!launchesFeed || !data.result) return;
        
        launchesFeed.innerHTML = '';
        const textbox = document.createElement('textarea');
        textbox.style.width = '100%';
        // textbox.style.height = '200px';
        textbox.style.backgroundColor = '#111';
        textbox.style.color = 'white';
        textbox.style.padding = '10px';
        
        const launchText = data.result.map(launch => 
    `Name: ${launch.name}
    Date: ${new Date(launch.t0).toLocaleString()}
    Provider: ${launch.provider.name}
    Vehicle: ${launch.vehicle.name}
    Location: ${launch.pad.name}
    ------------------------`
        ).join('\n');
    
        console.log(textbox);
        
        textbox.value = launchText;
        launchesFeed.appendChild(textbox);
    }
    
    let targetDate;
    
    function setDateToLaunch(data) {
        const date = new Date(); // New Date object
        date.setDate(date.getDate() + 30) // Current day plus 30 days
        targetDate = date;
        

        targetDate = new Date (data.result[0].t0);
        console.log(targetDate, data);
        // targetDate = date;

        // const d = new Date("October 13, 2014 11:13:00");
    }

// convert target date to a date object



        // set up variable to manage date rules
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

// set up the loop to update the countdown once a second
let x = setInterval(function() {

  // get the current time
  let now = new Date().getTime();
  
  // get the time remaining
  let distance = targetDate - now;

  // update the <span> tags with the countdown values
  document.querySelector('#days').innerHTML = Math.floor(distance / (day))+" days, ";
  document.querySelector('#hours').innerHTML = Math.floor((distance % (day)) / (hour))+" hours, ";
  document.querySelector('#minutes').innerHTML = Math.floor((distance % (hour)) / (minute))+" minutes, ";
  document.querySelector('#seconds').innerHTML = Math.floor((distance % (minute)) / second)+" seconds ";
}, second)