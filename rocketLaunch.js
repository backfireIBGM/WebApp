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
            // console.log(data);
    
            processLaunches(data);
            setTickerItems(data);
        } catch (error) {
            console.error('Error fetching launches:', error);
        }
}
    
function setDateToLaunch(data) {

    const countDownBox = document.createElement('div');
    countDownBox.className = 'infoColumnDiv';
    countDownBox.style.position = 'retive';
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
}
 
function setInitialGridWidths() {
    if (window.innerWidth > 576) {
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
    else {
        // Clear inline styles for small screens so CSS can take effect
        infoColumn.style.width = '';
        countdownColumn.style.width = '';
    }
}

function processLaunches(data) {
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
        countdownCell.style.backgroundSize = "cover";
        countdownCell.style.backgroundPosition = "center";

        countdownCell.appendChild(countdownText);
        countdownColumn.appendChild(countdownCell);

        switch (launch.vehicle.name) {
            case "Falcon 9":
                countdownCell.style.backgroundImage = "url('Falcon9.jpg')";
                break;
            case "Falcon Heavy":
                countdownCell.style.backgroundImage = "url('FalconHeavy.jpg')";
                break;
            case "Super Heavy / Starship Prototype":
                countdownCell.style.backgroundImage = "url('Starship.jpg')";
                break;
            case "New Glenn":
                countdownCell.style.backgroundImage = "url('New-Glenn.jpg')";
                break;
            case "Eris":
                countdownCell.style.backgroundImage = "url('Eris.jpg')";
                break;
            case "GSLV-II":
                countdownCell.style.backgroundImage = "url('GSLV_II.jpg')";
                break;
            case "Jielong-3":
                countdownCell.style.backgroundImage = "url('Jielong-3.jpg')";
            case "Long March 2D":
                countdownCell.style.backgroundImage = "url('Long March 2D.jpg')";
            case "Long March 8":
                countdownCell.style.backgroundImage = "url('LongMarch8.jpg')";
                break;
            case "Electron":
                countdownCell.style.backgroundImage = "url('Electron.jpg')";
                break;
            case "Ariane 6":
                countdownCell.style.backgroundImage = "url('Ariane6.jpg')";
                break;
            case "Soyuz-2":
                countdownCell.style.backgroundImage = "url('Soyuz-2.jpg')";
                break;
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
                // console.log(rocketInfo.height);
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
                        <p>Payload To Low Earth Orbit: ${rocketInfo.payloadToLeo}</p>
                        <p>Fairing Height: ${rocketInfo.payloadToLeo}</p>
                        <p>Fairing Diameter: ${rocketInfo.payloadToLeo}</p>
                        <p>Description: ${rocketInfo.description}</p>
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
        "Falcon 9": { // done
            height: "70 m / 229.6 ft",
            diameter: "3.7 m / 12 ft",
            mass: "549,054 kg / 1,207,920 ib",
            payloadToLeo: "22,800 kg / 50,265 ib",
            fairingHeight: "8,300 kg / 18,300 ib",
            fairingDiameter: "5.2 m / 17.1 ft",
            description: "Falcon 9 is a reusable, two-stage rocket designed and manufactured by SpaceX for the reliable and safe transport of people and payloads into Earth orbit and beyond."
        },
        "Falcon Heavy": { // done
            height: "70 m / 229.6 ft",
            diameter: "12.2 m / 39.9 ft",
            mass: "1,420,788 kg / 3,125,735 ib",
            payloadToLeo: "36,800 kg / 140,660 ib",
            fairingHeight: "13.1 m / 43 ft",
            fairingDiameter: "5.2 m / 17.1 ft",
            description: "Falcon Heavy comprises three reusable Falcon 9 nine-engine cores."
        },
        "Super Heavy / Starship Prototype": { // done
            height: "123 m / 403 ft",
            diameter: "9 m / 29.5 ft",
            mass: "Unknow",
            payloadToLeo: "100 - 150 t",
            fairingHeight: "Unknow",
            fairingDiameter: "Unknow",
            description: "SpaceX’s Starship spacecraft and Super Heavy rocket – collectively referred to as Starship – represent a fully reusable transportation system designed to carry both crew and cargo to Earth orbit, the Moon, Mars and beyond. Starship is the world’s most powerful launch vehicle ever."
        },
        "New Glenn": { // done
            height: "98 m / 322 ft",
            diameter: "7 m / 23 ft",
            mass: "Unknown",
            payloadToLeo: "45 t / 99,208 ib",
            fairingHeight: "5.4 m / 18 ft",
            fairingDiameter: "7 m / 22.97 ft",
            description: "New Glenn is a heavy-lift launch vehicle developed and operated by the American company Blue Origin. The rocket is designed to have a partially reusable, two-stage design with a diameter of 7 meters (23 ft). The first stage is powered by seven BE-4 engines, while the second stage relies on two BE-3U engines, all designed and built in-house by Blue Origin."
        },
        "Eris": { // done
            height: "25 m / 82.02 ft",
            diameter: "2 m / 6.56 ft)",
            mass: "Unknown",
            payloadToLeo: "305 kg / 672.41 ib",
            fairingHeight: "Unknown",
            fairingDiameter: "1.2 or 1.5 m / 3.94 or 4.92 ft",
            description: "Gilmour Space's innovative Eris orbital launch vehicles will deliver up to 305 kg to LEO with a first commercial launch expected in early 2025."
        },
        "GSLV-II": { // done
            height: "51.37 m / 168.5 ft",
            diameter: "Unknown",
            mass: "420 t / 925,942 ib",
            payloadToLeo: "6,000 kg / 13,227.74 ib",
            fairingHeight: "Unknown",
            fairingDiameter: "3.4 or 4 m / 11.15 or 13.12 ft",
            description: "Geosynchronous Satellite Launch Vehicle Mark II (GSLV Mk II) is the launch vehicle developed by India, to launch communication satellites in geo transfer orbit using cryogenic third stage. Initially Russian GK supplied cryogenic stages were used. Later cryogenic stage was indigenously developed and inducted in Jan 2014 from GSLV D5 onwards. This operational fourth generation launch vehicle is a three stage vehicle with four liquid strap-ons. The flight proven indigenously developed Cryogenic Upper Stage (CUS), forms the third stage of GSLV Mk II. From January 2014, the vehicle has achieved six consecutive successes"
        },
        "Jielong-3": { // done
            height: "31 m / 101.7 ft",
            diameter: "2.64 m / 8.66 ft",
            mass: "140 t /  ib",
            payloadToLeo: "1,500 kg / 3306.93 ib",
            fairingHeight: "Unknown",
            fairingDiameter: "3.35 m / 10.99 ft",
            description: "Jielong 3, also known as CZ-11A, is a solid rocket launcher developed by CASC, with the aim of making it a competitive commercial sea-launched launcher."
        },
        "Long March 2D": { // done
            height: "40.77 m / 134.7 ft",
            diameter: "3.35 m / 11 ft",
            mass: "232,250 kg / 512,020 ib",
            payloadToLeo: "3,500 kg / 7,700 ib",
            fairingHeight: "7.82 m / 25.66 ft",
            fairingDiameter: "3.35 / 10.99 ft",
            description: "LM-2D is a two-stage launch vehicle. It has an overall length of 41.056 m and a lift-off mass of 250 t. The maiden flight of LM-2D was in August, 1992. So far, the LM-2D enjoys a success rate of 100%."
        },
        "long March 8": { // done
            height: "50 m / 164.04 ft",
            diameter: "3.35 m / 11 ft",
            mass: "5,000, or 3,000, or 7,000 / 11,000, or 6,600, or 15,000 ib",
            payloadToLeo: "7,600 kg / 16755.13 ib",
            fairingHeight: "12.1 m / 39.7 ft",
            fairingDiameter: "4 m / 13.12 ft",
            description: "Long March 8 (Chinese: 长征八号运载火箭) is an orbital launch vehicle developed by the China Academy of Launch Vehicle Technology to launch up to 5000 kg to a 700 km altitude Sun-synchronous orbit (SSO). The rocket is based on the Long March 7 with its first stage and two boosters, along with the existing liquid hydrogen burning third stage of the Long March 3A/3B/3C and 7A as its second stage. The boosters are omitted in the \"core only\" variant that first flew on its second launch in February 2022."
        },
        "Electron": { // done
            height: "18 m / 59 ft",
            diameter: "1.2 m / 3.9 ft",
            mass: "13,000 kg / 28,660 lb",
            payloadToLeo: "300 kg / 661 lb",
            fairingHeight: "2.5 m / 8.2 ft",
            fairingDiameter: "1.2 m / 3.94 ft",
            description: "Electron is a two-stage, partially reusable orbital launch vehicle developed by Rocket Lab, an American aerospace company with a wholly owned New Zealand subsidiary. Servicing the commercial small satellite launch market, it is the third most launched small-lift launch vehicle in history. Its Rutherford engines are the first electric-pump-fed engine to power an orbital-class rocket. Electron is often flown with a kickstage or Rocket Lab's Photon spacecraft. Although the rocket was designed to be expendable, Rocket Lab has recovered the first stage twice and is working towards the capability of reusing the booster. The Flight 26 (F26) booster has featured the first helicopter catch recovery attempt. Rocket Lab has, however, abandoned the idea of catching Electron."
        },
        "Ariane 6": { // done
            height: "63 m / 207 ft",
            diameter: "5.4 m / 18 ft",
            mass: "10,350, or 21,650 kg / 22,820, or 47,730 ib",
            payloadToLeo: "10.3 t / 22,707.61 ib",
            fairingHeight: "14 or 20 m / 45.93, or 65.61 ft",
            fairingDiameter: "5.4 m / 17.71 ft",
            description: "Ariane 6 is a European expendable launch system developed for the European Space Agency (ESA) and manufactured by a consortium of European companies, led by the prime contractor ArianeGroup. As part of the Ariane rocket family, it is operated by Arianespace, replacing the Ariane 5. The project’s primary contributors were France (55%), Germany (21%), and Italy (7.6%), with the remaining work distributed among ten other participating countries."
        },
        "Soyuz-2": { // in work
            height: "46.3 m / 152 ft",
            diameter: "10.3 m / 33 ft 10 in",
            mass: "312,000 kg / 688,000 ib",
            payloadToLeo: "8,670 kg / 19,110 ib",
            fairingHeight: "11.43 m / 37.5 ft",
            fairingDiameter: "4.11 m / 13.49 ft",
            description: "Soyuz‑2 (Russian: Союз‑2, lit. 'Union‑2') (GRAU index: 14A14) is a modernized expendable medium-lift launch vehicle and the seventh major version of the Soyuz rocket family."
        },
        
    };

    return rocketSpecs[vehicleName] || {
        height: "Not available",
        diameter: "Not available",
        mass: "Not available",
        payloadToLeo: "Not available",
        fairingHeight: "Not available",
        fairingDiameter: "Not available",
        description: "Not available"
    };
}