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
    
            processLaunches2(data);
            setDateToLaunch(data);
        } catch (error) {
            console.error('Error fetching launches:', error);
        }
}

// function processLaunches(data) {
//         // console.log(data);
//         const Data = document.getElementById('data');
//         // if (!launchesFeed || !data.result) return;
        
//         // launchesFeed.innerHTML = '';
//         const textbox = document.createElement('textarea');
//         textbox.style.resize = "none";
//         textbox.style.width = '100%';
//         textbox.style.height = '90%';
//         textbox.style.backgroundColor = '#111';
//         textbox.style.color = 'white';
//         textbox.style.zIndex = 0;
//         textbox.style.fontSize = '150%';
//         textbox.readOnly = true;


        
        
//     const countText = data.result.map(launch => {
//         const launchDate = new Date(launch.t0);
//         const dateString = launchDate.getTime() === 0 ? "No Set Launch Time" : launchDate.toLocaleString();


//     return `Name: ${launch.name}
//     Date: ${dateString}
//     Provider: ${launch.provider.name}
//     Vehicle: ${launch.vehicle.name}
//     Location: ${launch.pad.name}
//     -----------------------------------`;
// }).join('\n');            

//     textbox.value = countText;
//     launchesFeed.appendChild(textbox);

//     textbox.onmouseover = () => {
//         showMoreInfo(data, true);
//     };
    
//     textbox.onmouseout = () => {
//         showMoreInfo(data, false);
//     };
// }
    
function setDateToLaunch(data) {

    const countDownBox = document.createElement('div');
    countDownBox.style.position = 'absolute';
    countDownBox.style.top = '20%';
    countDownBox.style.left = '59.0%';
    countDownBox.style.textAlign = 'center';
    countDownBox.style.fontSize = '200%';
    launchesFeed.appendChild(countDownBox);

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
    // Clear any existing intervals
    if (window.countdownIntervals) {
        window.countdownIntervals.forEach(interval => clearInterval(interval));
    }
    window.countdownIntervals = [];

    // Set up array of target dates for each box
    const targetDates = data.result.map((launch, index) => {
        // console.log(data.result[index].t0);
        // console.log(data.result[index].name);
        // console.log(launch, index)
        return new Date(data.result[index].t0);
    });

    //console.log("targetDates", targetDates);
    // Create separate interval for each box

    let testDates = Array(5).fill().map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);  // Add days
        //date.setHours(date.getHours() - 14);  // Subtract 14 hours
        //date.setMinutes(date.getMinutes() - 49);  // Subtract 30 minutes
        date.setSeconds(date.getSeconds() + 5);  // Add 5 seconds
        
        return date.toLocaleString('en-US')
    });
        
        
        // for real launches use targetDates
        // & for testing use testDates
        targetDates.forEach((date, index) => {
            const interval = setInterval(function() {
                let now = new Date().getTime();
                let distance = new Date(date).getTime() - now;

                // testDates.forEach(date => console.log(date));
                
                let hourString = Math.floor((distance % (day)) / (hour)) + ":";
                let minuteString = Math.floor((distance % (hour)) / (minute)) + ":";
                let secondString = Math.floor((distance % (minute)) / second);
    
                    function pad(num, size) {
                        num = num.toString();
                        while (num.length < size) num = "0" + num;
                        return num;
                    }
    
                    if (Math.floor(distance / (day)) > 0) {
                        hourString = pad(hourString, 3);
                    }
                    else {
                        hourString = pad(hourString, 2);
                    }

    
                    minuteString = pad(minuteString, 3);
                    secondString = pad(secondString, 2);
    
    
                    // console.log(hourString);
                    // console.log(minuteString);
                    // console.log(secondString);
    
    
                    if (distance > 0) {
                        if (Math.floor(distance / (day)) > 0)
                            {
                                document.querySelector(`#box${index} #counts${index}`).innerHTML = null;
                                document.querySelector(`#box${index} #days${index}`).innerHTML = Math.floor(distance / (day)) + ":";
                            }
                            else
                            {
                                document.querySelector(`#box${index} #counts${index}`).innerHTML = "T-";
                                document.querySelector(`#box${index} #days${index}`).innerHTML = null;
                            }
                            document.querySelector(`#box${index} #hours${index}`).innerHTML = hourString;
                            document.querySelector(`#box${index} #minutes${index}`).innerHTML = minuteString;
                            document.querySelector(`#box${index} #seconds${index}`).innerHTML = secondString;
                  }
                }, second);
                
                window.countdownIntervals.push(interval);
    });
}

function showMoreInfo(data, isHovered) {
    const targetRockets = [
        "Falcon 9",
        "New Glenn", 
        "Super Heavy / Starship Prototype",
        "Eris",
        "GSLV-II"
    ];
    const moreInfoDiv = document.getElementById('moreInfo');
    
    data.result.forEach((launch, index) => {
        // console.log(launch.vehicle.name);
        console.log(isHovered);

        if (isHovered) {
            // Only create elements if they don't exist and we're showing them
            div = document.createElement('div');
            div.id = `Info${index}`;
            
            img = document.createElement('img');
            img.id = `Img${index}`;
            
            switch (launch.vehicle.name) {
                case "Falcon 9":
                    handleFalcon9(img, index);
                    break;
                case "New Glenn":
                    handleNewGlenn(img, index);
                    break;
                case "Super Heavy / Starship Prototype":
                    handleStarship(img, index);
                    break;
                case "Eris":
                    handleEris(img, index);
                    break;
                case "GSLV-II":
                    handleGSLV2(img, index);
                    break;
                default:
                    console.warn(`Unexpected rocket type: ${launch.vehicle.name}`);
            }

            
            img.style.position = "absolute";
            img.style.visibility = "hidden";
            
            div.appendChild(img);
            moreInfoDiv.appendChild(div);
        }
    });

    data.result.forEach((launch, index) => {
        if (targetRockets.includes(launch.vehicle.name)) {
            const existingImg = document.getElementById(`Img${index}`);
            if (existingImg) {
                existingImg.style.visibility = isHovered ? "visible" : "hidden";
            }
        }
    });
}

function handleFalcon9(img, index) {
        // img.src = 'Falcon9.jpg';
        img.style.transform = "scale(0.6)";
        img.style.paddingLeft = "75%";

        // index = 0;

        switch (index) {
            case 0:
                img.style.paddingTop = "9.4%";
                break;
            case 1:
                img.style.paddingTop = "18%";
                break;
            case 2:
                img.style.paddingTop = "27%";
                break;
            case 3:
                img.style.paddingTop = "36%";
                break;
            default:
                img.style.paddingTop = "45%";
                break;
        }
}
function handleStarship(img, index) {
        // img.src = 'StarShip.jpg';
        img.style.transform = "scale(0.45)";
        img.style.paddingLeft = "81%";

        // index = 4;

        switch (index) {
            case 0:
                img.style.paddingTop = "8.8%";
                break;
            case 1:
                img.style.paddingTop = "18.4%";
                break;
            case 2:
                img.style.paddingTop = "28%";
                break;
            case 3:
                img.style.paddingTop = "37.6%";
                break;
            default:
                img.style.paddingTop = "48.2%";
                break;
        }
}
function handleNewGlenn(img, index) {
        img.src = 'New-Glenn.jpg';
        img.style.transform = "scale(0.1)";
        img.style.paddingLeft = "25%";

        index = 0;

        switch (index) {
            case 0:
                img.style.paddingTop = "-110%";
                break;
            case 1:
                img.style.paddingTop = "8.8%";
                break;
            case 2:
                img.style.paddingTop = "8.8%";
                break;
            case 3:
                img.style.paddingTop = "8.8%";
                break;
            default:
                img.style.paddingTop = "8.8%";
                break;
        }
}
function handleEris(img, index) {
        // img.src = 'Eris.jpg';
        img.style.transform = "scale(0.6)";
        img.style.paddingLeft = "1070%";

        // index = 4;

        switch (index) {
            case 0:
                img.style.transform = "scale(0.6) translate(1070%, 82%)";
                break;
            case 1:
                img.style.transform = "scale(0.6) translate(1070%, 160%)";
                break;
            case 2:
                img.style.transform = "scale(0.6) translate(1070%, 240%)";
                break;
            case 3:
                img.style.paddingTop = "8.8%";
                break;
            default:
                img.style.paddingTop = "8.8%";
                break;
        }
}
function handleGSLV2(img, index) {
        // img.src = 'GSLV_II.jpg';
        img.style.transform = "scale(0.6)";
        img.style.paddingLeft = "75%";

        // index = 4;

        switch (index) {
            case 0:
                img.style.transform = "scale(0.4) translate(1830%, 75%)";
                break;
            case 1:
                img.style.transform = "scale(0.4) translate(1830%, 180%)";
                break;
            case 2:
                img.style.transform = "scale(0.4) translate(1830%, 290%)";
                break;
            case 3:
                img.style.transform = "scale(0.4) translate(1830%, 395%)";
                break;
            default:
                img.style.transform = "scale(0.4) translate(1830%, 505%)";
                break;
        }
}

function processLaunches2(data) {
    const container = document.getElementsByClassName('launches-grid')[0];
    
    if (window.countdownIntervals) {
        window.countdownIntervals.forEach(interval => clearInterval(interval));
    }
    window.countdownIntervals = [];
    
    const infoColumn = document.createElement('div');
    infoColumn.className = 'info-column';
    
    const countdownColumn = document.createElement('div');
    countdownColumn.className = 'countdown-column';

    const imageColumn = document.createElement('div');
    imageColumn.className = 'image-column';
    
    data.result.forEach((launch, index) => {
        const launchDate = new Date(launch.t0);
        const dateString = launchDate.getTime() === 0 ? "No Set Launch Time" : launchDate.toLocaleString();

        // Info cell
        const infoCell = document.createElement('div');
        infoCell.className = 'grid-item';
        infoCell.innerHTML = `
            <h3>${launch.name}</h3>
            <p>Date: ${dateString}</p>
            <p>Provider: ${launch.provider.name}</p>
            <p>Vehicle: ${launch.vehicle.name}</p>
            <p>Location: ${launch.pad.name}</p>
        `;
        infoColumn.appendChild(infoCell);
        
        // Countdown cell
        const countdownCell = document.createElement('div');
        countdownCell.className = 'grid-item';
        const countdownText = document.createElement('div');
        countdownText.id = `countdown-${index}`;
        countdownCell.appendChild(countdownText);
        countdownColumn.appendChild(countdownCell);

        // Image cell
        const imageCell = document.createElement('div');
        imageCell.className = 'grid-item';
        if (launch.image) {
            const img = document.createElement('img');
            img.src = launch.image;
            imageCell.appendChild(img);
        }
        imageColumn.appendChild(imageCell);


        

        if (launchDate.getTime() !== 0) {
            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = launchDate.getTime() - now;

                if (distance < 0) {
                    countdownText.innerHTML = "T0";
                    return;
                }

                const days = Math.floor(distance / day);
                const hours = Math.floor((distance % day) / hour);
                const minutes = Math.floor((distance % hour) / minute);
                const seconds = Math.floor((distance % minute) / second);

                let displayTime;
                
                const formattedHours = hours < 10 ? `0${hours}` : hours;
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
                
                if (days > 0) {
                    displayTime = `${days}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
                } else if (minutes > 0 || hours > 0) {
                    if (hours >= 10) {
                        displayTime = `T- ${hours}:${formattedMinutes}:${formattedSeconds}`;
                    } else if (hours >= 1) {
                        displayTime = `T- ${hours}:${formattedMinutes}:${formattedSeconds}`;
                    } else {
                        displayTime = `T- ${formattedMinutes}:${formattedSeconds}`;
                    }
                } else if (seconds <= 10) {
                    const decimalSeconds = seconds + (distance % 1000) / 1000;
                    displayTime = `T- ${decimalSeconds.toFixed(2)}`;
                    if (decimalSeconds < 1) {
                        displayTime = `T- 0${decimalSeconds.toFixed(2)}`;
                    }
                }
                countdownText.innerHTML = `<span class="time-unit">${displayTime}</span>`;
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, second);
            window.countdownIntervals.push(interval);
        } else {
            countdownText.innerHTML = "Launch date TBD";
        }
    });
    
    container.appendChild(infoColumn);
    container.appendChild(countdownColumn);
    container.appendChild(imageColumn);
}