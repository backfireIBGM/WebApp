const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";
const proxyUrl = 'https://corsproxy.io/';

// set up variable to manage date rules
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

fetchLaunches(proxyUrl, jsonRocketLaunches)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    async function fetchLaunches(proxyUrl, url) {
        try {
            // console.log("test");
            const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log(data);
    
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
    
    function setDateToLaunch(data) {
        // Clear any existing intervals
        if (window.countdownIntervals) {
            window.countdownIntervals.forEach(interval => clearInterval(interval));
        }
        window.countdownIntervals = [];
    
        // Set up array of target dates for each box
        const targetDates = data.result.map((launch, index) => {
            console.log(data.result[index].t0);
            // console.log(data.result[index].name);
            // console.log(launch, index)
            return new Date(data.result[index].t0);
        });
        //console.log("targetDates", targetDates);
        // Create separate interval for each box
        targetDates.forEach((date, index) => {
            
            const interval = setInterval(function() {
                let now = new Date().getTime();
                let distance = date - now;
                
                document.querySelector(`#box${index} #days`).innerHTML = Math.floor(distance / (day)) + " days, ";
                document.querySelector(`#box${index} #hours`).innerHTML = Math.floor((distance % (day)) / (hour)) + " hours, ";
                document.querySelector(`#box${index} #minutes`).innerHTML = Math.floor((distance % (hour)) / (minute)) + " minutes, ";
                document.querySelector(`#box${index} #seconds`).innerHTML = Math.floor((distance % (minute)) / second) + " seconds ";
            }, second);
            
            window.countdownIntervals.push(interval);
        });
    }