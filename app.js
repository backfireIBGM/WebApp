const proxyUrl = 'https://corsproxy.io/';

const rssUrl = ['https://www.youtube.com/feeds/videos.xml?channel_id=UCSUu1lih2RifWkKtDOJdsBA',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UC6uKrU_WqJ1R2HMTY3LIx5Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCy6Q9UCG7Wa-N7nht2BFrHA'];


const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";



async function fetchRSSWithProxy(proxyUrl, rssUrl) {
    try {
        //console.log(rssUrl);
        const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(rssUrl)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rssText = await response.text();
        // console.log(rssText);
        return rssText;
    } catch (error) {
        console.error('Error fetching RSS feed through proxy:', error);
        throw error;
    }
}

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

function parseRSS(rssText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, 'text/xml');
    return xmlDoc;
}

async function fetchAllRSSFeeds(proxyUrl, rssUrls) {
    try {
        // Create an array of promises for all RSS feeds
        const feedPromises = rssUrls.map(url => fetchRSSWithProxy(proxyUrl, url));
       // console.log(feedPromises);

        const results = await Promise.all(feedPromises); // Wait for all promises to resolve

        // Process each feed
        const allFeedItems = [];
        for (const rssText of results) {
            const xmlDoc = parseRSS(rssText);
            const feedItems = extractFeedItems(xmlDoc);
            allFeedItems.push(...feedItems);  // Push the current feed items
        }

        return allFeedItems;
    } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        throw error;
    }
}

function extractFeedItems(xmlDoc) {
    const entries = xmlDoc.getElementsByTagName('entry');
    const feedItems = [];

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        feedItems.push({
            channelId: entry.querySelector('channelId')?.textContent,
            id: entry.querySelector('videoId')?.textContent,
            title: entry.querySelector('title')?.textContent,
            link: entry.querySelector('link')?.getAttribute('href'),
            published: entry.querySelector('published')?.textContent,
            thumbnail: entry.querySelector('thumbnail')?.getAttribute('url'),
            thumbnailWidth: entry.querySelector('thumbnail')?.getAttribute('width'),
            thumbnailHeight: entry.querySelector('thumbnail')?.getAttribute('height'),
            description: entry.querySelector('media\\:descriotion, description')?.textContent
        });
    }

    // console.log("feedItems");
    return feedItems;
}

function extractRocketLaucnes(xmlDoc) {
    const entries = xmlRocketDoc.getElementsByTagName('entry');
    

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        rocketFeedItems.push({
            name: entry.querySelector('name')?.textContent,
        });

    console.log(rocketFeedItems);
    return rocketFeedItems;
    }
}


document.getElementById('searchBox').addEventListener('keyup', function () {
    processFeed(allFeedItems, this.value.toLowerCase());
});

// let allFeedItems = [];

function processFeed(feedItems, isSearch) {
    if (isSearch) {
        // console.log("search")
        document.body.classList.add('search-active');
        processSearchFeed(feedItems, isSearch);  
        document.getElementById("leftFeed").classList.add("hidden");
        document.getElementById("middleFeed").classList.add("hidden");
        document.getElementById("rightFeed").classList.add("hidden");
        document.getElementById("searchFeed").classList.remove("hidden");
    }
    else {
        // Clear the search feed
        document.getElementById('searchFeed').innerHTML = '';
        
        // Reload all three column feeds with complete data
        processLeftFeed(allFeedItems);  // Use allFeedItems instead of feedItems
        processMiddleFeed(allFeedItems);
        processRightFeed(allFeedItems);
        
        // Show the three feeds and hide search
        document.getElementById("leftFeed").classList.remove("hidden");
        document.getElementById("middleFeed").classList.remove("hidden");
        document.getElementById("rightFeed").classList.remove("hidden");
        document.getElementById("searchFeed").classList.add("hidden");
        document.body.classList.remove('search-active');
    }
}

function processSearchFeed(feedItems, isSearch) {

    document.getElementById("leftFeed").classList.add("hidden");
    document.getElementById("middleFeed").classList.add("hidden");
    document.getElementById("rightFeed").classList.add("hidden");
    document.getElementById("searchFeed").classList.remove("hidden");


    const searchFeed = document.getElementById('searchFeed');
    searchFeed.innerHTML = '';



    let searchResults = []

    for (let key in feedItems) {
        if (feedItems[key].title.toLowerCase().includes(isSearch) || feedItems[key].description.toLowerCase().includes(isSearch)) {
            searchResults.push(feedItems[key]);
        }

       // console.log(isSearch);
    }

        // Format date function
        const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    searchResults.forEach(item => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';

        // Create title with link
        const title = document.createElement('h2');
        title.className = 'title';

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.title;
        link.onmouseover = () => link.style.textDecoration = 'underline';
        link.onmouseout = () => link.style.textDecoration = 'none';
        link.target = "_blank";

        const published = document.createElement('span'); // Create published date span
        published.textContent = formatDate(item.published);
        published.className = 'date';

        const thumbnail = document.createElement('img');
        thumbnail.src = item.thumbnail;
        thumbnail.alt = item.title;

        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = link.href;
        thumbnailLink.target = "_blank";
        thumbnailLink.appendChild(thumbnail);


        // Assemble the card
        title.appendChild(link);
        card.appendChild(thumbnailLink);
        card.appendChild(title);
        card.appendChild(published);
        searchFeed.appendChild(card);
    });
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


function processLeftFeed(feedItems) {
    const leftFeedContainer = document.getElementById('leftFeed');
    leftFeedContainer.innerHTML = '';
    

    let leftResults = []

    for (channelKey in feedItems) {
        if (feedItems[channelKey].channelId.includes("UCSUu1lih2RifWkKtDOJdsBA")) {
            leftResults.push(feedItems[channelKey]);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    

    leftResults.forEach(item => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';

        // Create title with link
        const title = document.createElement('h2');
        title.className = 'title';

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.title;
        link.onmouseover = () => link.style.textDecoration = 'underline';
        link.onmouseout = () => link.style.textDecoration = 'none';
        link.target = "_blank";

        const published = document.createElement('span'); // Create published date span
        published.textContent = formatDate(item.published);
        published.className = 'date';

        const thumbnail = document.createElement('img');
        thumbnail.src = item.thumbnail;
        thumbnail.alt = item.title;

        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = link.href;
        thumbnailLink.target = "_blank";
        thumbnailLink.appendChild(thumbnail);


        // Assemble the card
        title.appendChild(link);
        card.appendChild(thumbnailLink);
        card.appendChild(title);
        card.appendChild(published);
        leftFeedContainer.appendChild(card);
    });
}

function processMiddleFeed(feedItems) {
    const miiddFeedContainer = document.getElementById('middleFeed');
    miiddFeedContainer.innerHTML = '';

    let middleResults = []

    for (channelKey in feedItems) {
        if (feedItems[channelKey].channelId.includes("UC6uKrU_WqJ1R2HMTY3LIx5Q")) {
            middleResults.push(feedItems[channelKey]);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    middleResults.forEach(item => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';

        // Create title with link
        const title = document.createElement('h2');
        title.className = 'title';

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.title;
        link.onmouseover = () => link.style.textDecoration = 'underline';
        link.onmouseout = () => link.style.textDecoration = 'none';
        link.target = "_blank";

        const published = document.createElement('span'); // Create published date span
        published.textContent = formatDate(item.published);
        published.className = 'date';

        const thumbnail = document.createElement('img');
        thumbnail.src = item.thumbnail;
        thumbnail.alt = item.title;

        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = link.href;
        thumbnailLink.target = "_blank";
        thumbnailLink.appendChild(thumbnail);


        // Assemble the card
        title.appendChild(link);
        card.appendChild(thumbnailLink);
        card.appendChild(title);
        card.appendChild(published);
        miiddFeedContainer.appendChild(card);
    });
}
function processRightFeed(feedItems) {
    const rightFeedContainer = document.getElementById('rightFeed');
    rightFeedContainer.innerHTML = '';
    //Headers.appendChild(feed-header);

    let rightResults = []

    for (channelKey in feedItems) {
        if (feedItems[channelKey].channelId.includes("UCy6Q9UCG7Wa-N7nht2BFrHA")) {
            rightResults.push(feedItems[channelKey]);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    rightResults.forEach(item => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';

        // Create title with link
        const title = document.createElement('h2');
        title.className = 'title';

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.title;
        link.onmouseover = () => link.style.textDecoration = 'underline';
        link.onmouseout = () => link.style.textDecoration = 'none';
        link.target = "_blank";

        const published = document.createElement('span'); // Create published date span
        published.textContent = formatDate(item.published);
        published.className = 'date';

        const thumbnail = document.createElement('img');
        thumbnail.src = item.thumbnail;
        thumbnail.alt = item.title;

        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = link.href;
        thumbnailLink.target = "_blank";
        thumbnailLink.appendChild(thumbnail);


        // Assemble the card
        title.appendChild(link);
        card.appendChild(thumbnailLink);
        card.appendChild(title);
        card.appendChild(published);
        rightFeedContainer.appendChild(card);
    });
}

document.getElementById('searchBox').addEventListener('keyup', function() {
    const searchValue = this.value.trim().toLowerCase();
    if (searchValue === '') {  // If search is empty or cleared
        processFeed(allFeedItems, '');  // Pass empty string to trigger the else condition
    } else {
        processFeed(allFeedItems, searchValue);
    }
});

// Add this event listener for the search input's clear button (X)
document.getElementById('searchBox').addEventListener('search', function() {
    if (this.value === '') {  // This will trigger when X is clicked
        processFeed(allFeedItems, '');
    }
});

// Update your fetchLaunches .then() call
// fetchLaunches(proxyUrl, jsonRocketLaunches)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

fetchAllRSSFeeds(proxyUrl, rssUrl)
    .then(feedItems => {
        allFeedItems = feedItems;
        processFeed(feedItems, document.getElementById('searchBox').checked);
    })
    .catch(error => {
        console.error('Error:', error);
    });

