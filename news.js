const proxyUrl = 'https://corsproxy.io/';
const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";

fetchLaunches(proxyUrl, jsonRocketLaunches);
getSpaceNewsWithEvent();

async function fetchLaunches(proxyUrl, url) {
    try {
        // console.log("test");
        const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTickerItems(data);
    } catch (error) {
        console.error('Error fetching launches:', error);
    }
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

async function getSpaceNewsWithEvent() {
    try {
        const response = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=3');
        const data = await response.json();
        
        // Log the entire response data
        // console.log(data);
        
        // Access specific properties
        if (data.results.length > 0) {
            data.results.forEach(article => {
                console.log({
                    title: article.title,
                    news_site: article.news_site,
                    events: article.events,
                    Images: article.image_url
                });
                
                showResult(article);
            });

            
        } else {
            console.log('error');
        }
        
    } catch (error) {
        console.error('Error fetching space news:', error);
    }
}

function showResult(article) {
    const container = document.getElementById('news-grid');
    console.log("data");

    const infoColumn = document.createElement('div');
    infoColumn.className = 'name-column';

    const countdownColumn = document.createElement('div');
    countdownColumn.className = 'image-column';

    const articleCell = document.createElement('div');
    articleCell.className = 'article-cell';
    articleCell.innerHTML = `
        <h3>${article.title}</h3>
    `;

    const articleImage = document.createElement('div');
    articleImage.className = 'image-column';

    const articleImageCell = document.createElement('div');
    articleImageCell.className = 'article-image-cell';
    articleImageCell.style.backgroundImage = `url('${article.image_url}')`;
    articleImageCell.style.backgroundSize = 'cover';
    articleImageCell.style.backgroundPosition = 'center';

    container.appendChild(articleCell);
    container.appendChild(articleImageCell);
}