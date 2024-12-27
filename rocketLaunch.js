const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";
const proxyUrl = 'https://corsproxy.io/';

// set up variable to manage date rules
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

fetchLaunches(proxyUrl, jsonRocketLaunches)
    .then(data => {
        //console.log(data);
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
            // console.log(data);
    
            processLaunches(data);
            setDateToLaunch(data);
        } catch (error) {
            console.error('Error fetching launches:', error);
        }
    }

    function processLaunches(data) {
        console.log(data);
        const Data = document.getElementById('data');
        // if (!launchesFeed || !data.result) return;
        
        // launchesFeed.innerHTML = '';
        const textbox = document.createElement('textarea');
        textbox.style.resize = "none";
        textbox.style.width = '100%';
        textbox.style.height = '100%';
        textbox.style.backgroundColor = '#111';
        textbox.style.color = 'white';
        textbox.style.padding = '10px';
        textbox.style.zIndex = 0;
        textbox.style.fontSize = '150%';
        textbox.readOnly = true;

        const countDownBox = document.createElement('div');
        countDownBox.style.position = 'absolute';
        countDownBox.style.top = '20%'; // Add units for top positioning
        countDownBox.style.left = '55%'; // Add units for right positioning
        countDownBox.style.textAlign = 'center';
        
        
        const countText = data.result.map(launch => {
            const launchDate = new Date(launch.t0);
            const dateString = launchDate.getTime() === 0 ? "No Set Launch Time" : launchDate.toLocaleString();


    return `Name: ${launch.name}
    Date: ${dateString}
    Provider: ${launch.provider.name}
    Vehicle: ${launch.vehicle.name}
    Location: ${launch.pad.name}
    -------------------------------------------------`;
}).join('\n');

        for (let i = 0; i < 5; i++) {
            // if (dateString = launchDate.getTime() === 0) {
            //     console.log(i);
            // }
                const box = document.createElement('main');
                box.className = 'countdown-box';
                box.id = `box${i}`;
    
                const counts = document.createElement('saan');
                counts.id = `counts${i}`;
                
                const days = document.createElement('span');
                days.className = 'time-unit';
                days.id = `days${i}`;
    
                const hours = document.createElement('span');
                hours.className = 'time-unit';
                hours.id = `hours${i}`;
    
                const minutes = document.createElement('span');
                minutes.className = 'time-unit';
                minutes.id = `minutes${i}`;
            
                const seconds = document.createElement('span');
                seconds.className = 'time-unit';
                seconds.id = `seconds${i}`;
    
                box.appendChild(counts);
                box.appendChild(days);
                box.appendChild(hours);
                box.appendChild(minutes);
                box.appendChild(seconds);
    
                countDownBox.appendChild(box);
            }
            
            textbox.value = countText;
            launchesFeed.appendChild(textbox);
            launchesFeed.appendChild(countDownBox);
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

            // if (date != null) {
            //     console.log(index);
            // }
            
            const interval = setInterval(function() {
                let now = new Date().getTime();
                let distance = date - now;


                let hourString = Math.floor((distance % (day)) / (hour)) + ":";
                let minuteString = Math.floor((distance % (hour)) / (minute)) + ":";
                let secondString = Math.floor((distance % (minute)) / second);

                function pad(num, size) {
                    num = num.toString();
                    while (num.length < size) num = "0" + num;
                    return num;
                }

                hourString = pad(hourString, 3);
                minuteString = pad(minuteString, 3);
                secondString = pad(secondString, 2);


                // console.log(hourString);
                // console.log(minuteString);
                // console.log(secondString);


                if (Math.floor(distance / (day)) > 0)
                {
                    document.querySelector(`#box${index} #counts${index}`).innerHTML = null;
                    document.querySelector(`#box${index} #days${index}`).innerHTML = Math.floor(distance / (day)) + ":";
                }
                else
                {
                    document.querySelector(`#box${index} #counts${index}`).innerHTML = "T-";
                }

                document.querySelector(`#box${index} #hours${index}`).innerHTML = hourString;
                document.querySelector(`#box${index} #minutes${index}`).innerHTML = minuteString;
                document.querySelector(`#box${index} #seconds${index}`).innerHTML = secondString;
            }, second);
            
            window.countdownIntervals.push(interval);
        });
    }