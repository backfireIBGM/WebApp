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
        textbox.style.height = '200px';
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