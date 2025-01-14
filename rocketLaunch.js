const proxyUrl = 'https://corsproxy.io/';
const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";

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
            console.log(data);
    
            processLaunches2(data);
            setTickerItems(data);
        } catch (error) {
            console.error('Error fetching launches:', error);
        }
}
    
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
                    handleFalcon9(img);
                    break;
                case "New Glenn":
                    handleNewGlenn(img);
                    break;
                case "Super Heavy / Starship Prototype":
                    handleStarship(img);
                    break;
                case "Eris":
                    handleEris(img);
                    break;
                case "GSLV-II":
                    handleGSLV2(img);
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

function handleFalcon9(countdownCell) {
    countdownCell.style.backgroundImage = "url('Falcon9.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}

function handleStarship(countdownCell) {
    countdownCell.style.backgroundImage = "url('StarShip.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}

function handleNewGlenn(countdownCell) {
    countdownCell.style.backgroundImage = "url('New-Glenn.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}

function handleEris(countdownCell) {
    countdownCell.style.backgroundImage = "url('Eris.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}

function handleGSLV2(countdownCell) {
    countdownCell.style.backgroundImage = "url('GSLV_II.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}

function handleJielong3(countdownCell) {
    countdownCell.style.backgroundImage = "url('Jielong-3.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}

function handleLongMarch2D(countdownCell) {
    countdownCell.style.backgroundImage = "url('Long March 2D.jpg')";
    countdownCell.style.backgroundSize = "cover";
    countdownCell.style.backgroundPosition = "center";
}
 
function setInitialGridWidths() {
    const infoColumn = document.querySelector('.info-column');
    const countdownColumn = document.querySelector('.countdown-column');
    
    // Force layout calculation
    infoColumn.style.width = 'fit-content';
    countdownColumn.style.width = 'fit-content';
    
    // Get and set fixed widths
    const infoWidth = infoColumn.offsetWidth;
    const countdownWidth = countdownColumn.offsetWidth;
    
    infoColumn.style.width = `${infoWidth}px`;
    countdownColumn.style.width = `${countdownWidth}px`;
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

    const rocketInfoColumn = document.createElement('div');
    rocketInfoColumn.className = 'rocket-info-column';
    
    data.result.forEach((launch, index) => {
        const launchDate = new Date(launch.t0);
        let dateString;

        if (launch.win_open != null && launch.win_close != null) {
            dateString = `Window is from: ${launch.win_open} to ${launch.win_close}`;
        }
        else if (launch.win_open != null) {
            dateString = `Window Opens: ${launch.win_open}`;
        }
        else if (launch.win_close != null) {
            dateString = `Window Closes: ${launch.win_close}`;
        }
        else if (launch.t0 != null) {
            dateString = `TO: ${launchDate}`;
        }
        else {
            dateString = "Awaiting T0";
        }

        // Info cell
        const infoCell = document.createElement('div');
        infoCell.className = 'grid-item';
        infoCell.classList.add('launch'+ (index + 1));
        infoCell.innerHTML = `
            <h3>${launch.name}</h3>
            <p>Provider: ${launch.provider.name}</p>
            <p>${dateString}</p>
            <p>Launch Pad: ${launch.pad.name}</p>
        `;
        infoColumn.appendChild(infoCell);
        
        // Countdown cell
        const countdownCell = document.createElement('div');
        countdownCell.className = 'grid-item';
        const countdownText = document.createElement('div');
        countdownText.id = `countdown-${index}`;
        countdownText.className = 'timerBox';

        countdownCell.appendChild(countdownText);
        countdownColumn.appendChild(countdownCell);

        const targetRockets = [
            "Falcon 9",
            "New Glenn", 
            "Super Heavy / Starship Prototype",
            "Eris",
            "GSLV-II",
            "Jielong-3"
        ];

        switch (launch.vehicle.name) {
            case "Falcon 9":
                handleFalcon9(countdownCell);
                break;
            case "New Glenn":
                handleNewGlenn(countdownCell);
                break;
            case "Super Heavy / Starship Prototype":
                handleStarship(countdownCell);
                break;
            case "Eris":
                handleEris(countdownCell);
                break;
            case "GSLV-II":
                handleGSLV2(countdownCell);
                break;
            case "Jielong-3":
                handleJielong3(countdownCell);
            case "Long March 2D":
                handleLongMarch2D(countdownCell);
            default:
                console.warn(`Unexpected rocket type: ${launch.vehicle.name}`);
        }


                // Rocket info cell
                const rocketInfoCell = document.createElement('div');
                rocketInfoCell.className = 'grid-item';
                rocketInfoCell.classList.add('launch'+ (index + 1));
                
                let vehicleName = launch.vehicle.name;
                if (vehicleName == "Super Heavy / Starship Prototype") {
                    vehicleName = "Starship"
                }
                
                let rocketInfo = getRocketInfo(launch.vehicle.name);
                console.log(rocketInfo.height);
                if (rocketInfo.height == "Not available") {
                    rocketInfoCell.innerHTML = `
                    <h3>Vehicle: ${vehicleName}</h3>
                    <p>No info available</p>
                `;
                }
                else {
                    rocketInfoCell.innerHTML = `
                        <h3>Vehicle: ${vehicleName}</h3>
                        <p>Height: ${rocketInfo.height}</p>
                        <p>Diameter: ${rocketInfo.diameter}</p>
                        <p>Mass: ${rocketInfo.mass}</p>
                        <p>Thrust: ${rocketInfo.thrust}</p>
                        <p>${rocketInfo.description}</p>
                    `;
                }
                rocketInfoColumn.appendChild(rocketInfoCell);





        

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
            countdownText.innerHTML = "Awaiting T0";
        }
    });
    
    container.appendChild(infoColumn);
    container.appendChild(rocketInfoColumn);
    container.appendChild(countdownColumn);
    setInitialGridWidths();
}

function setTickerItems(data) {
    const ticker = document.getElementsByClassName('ticker')[0];
    
    // Clear existing ticker items if any
    ticker.innerHTML = '';

    // Create and append the initial "Next Five Launches" text
    const initialItem = document.createElement('div');
    initialItem.classList.add('ticker_item');
    initialItem.textContent = "The Next Five Launches Are:";
    ticker.appendChild(initialItem);

    // Process each launch
    data.result.forEach((launch, index) => {
        if (launch.mission_description) {
            const item = document.createElement('div');
            item.classList.add('ticker_item');
            item.classList.add('launch' + (index + 1));
            item.textContent = `${launch.name}: ${launch.mission_description}`;
            ticker.appendChild(item);
        }
    });

    // If there weren't any mission descriptions, add a fallback message
    if (ticker.children.length === 1) {
        const fallbackItem = document.createElement('div');
        fallbackItem.classList.add('ticker_item');
        fallbackItem.textContent = "No mission descriptions available";
        ticker.appendChild(fallbackItem);
    }
}

function getRocketInfo(vehicleName) {
    const rocketSpecs = {
        "Falcon 9": {
            height: "70 m (230 ft)",
            diameter: "3.7 m (12 ft)",
            mass: "549,054 kg (1,210,457 lb)",
            thrust: "7,607 kN (1,710,000 lbf)",
            description: "Two-stage-to-orbit medium lift launch vehicle with reusable first stage."
        },
        "New Glenn": {
            height: "98 m (322 ft)",
            diameter: "7 m (23 ft)",
            mass: "Unknown",
            thrust: "17,100 kN (3,850,000 lbf)",
            description: "Heavy-lift orbital launch vehicle with reusable first stage."
        },
        "Super Heavy / Starship Prototype": {
            height: "120 m (394 ft)",
            diameter: "9 m (30 ft)",
            mass: "5,000,000 kg (11,000,000 lb)",
            thrust: "74,000 kN (16,600,000 lbf)",
            description: "Fully reusable super heavy-lift launch vehicle system."
        },
        "Eris": {
            height: "40.5 m (133 ft)",
            diameter: "2.8 m (9.2 ft)",
            mass: "Unknown",
            thrust: "1,000 kN (225,000 lbf)",
            description: "Three-stage small-lift launch vehicle designed for small satellite deployment."
        },
        "GSLV-II": {
            height: "49 m (161 ft)",
            diameter: "2.8 m (9.2 ft)",
            mass: "414,750 kg (914,360 lb)",
            thrust: "6,810 kN (1,530,000 lbf)",
            description: "Three-stage medium-lift launch vehicle for both LEO and GTO missions."
        }
    };

    return rocketSpecs[vehicleName] || {
        height: "Not available",
        diameter: "Not available",
        mass: "Not available",
        thrust: "Not available",
        description: "Specifications not available for this vehicle."
    };
}