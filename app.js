const proxyUrl = 'https://corsproxy.io/';
const jsonRocketLaunches = "https://fdo.rocketlaunch.live/json/launches/next/5";

const rssUrl = ['https://www.youtube.com/feeds/videos.xml?channel_id=UCSUu1lih2RifWkKtDOJdsBA',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UC6uKrU_WqJ1R2HMTY3LIx5Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCy6Q9UCG7Wa-N7nht2BFrHA',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCelXvXZDvx8_TdOOffevzGg',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCNxwUG0Vq8TztWdxL83FLHQ',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCBNHHEoiSF8pcLgqLKVugOw',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCILl8ozWuxnFYXIe2svjHhg',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCsXVk37bltHxD1rDPwtNM8Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCciQ8wFcVoIIMi-lfu8-cjQ',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCYNbYGl89UUowy8oXkipC-Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UC1XvxnHFtWruS9egyFasP1Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCFwMITSkc1Fms6PoJoh1OUQ',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCQbKe0RZ62u47TZ8vmKNnRA'];



let leftFeedIds = [];

let middleFeedIds = [];

let rightFeedIds = [];

// Helper function to get RSS URL for a channel ID
const getRssUrl = (channelId) => `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

// Helper function to get RSS URLs for a feed
const getFeedUrls = (feedIds) => feedIds.map(id => getRssUrl(id));

const removeFromFeed = (channelId, feedPosition) => {
    switch(feedPosition) {
        case 'left':
            leftFeedIds = leftFeedIds.filter(id => id !== channelId);
            break;
        case 'middle':
            middleFeedIds = middleFeedIds.filter(id => id !== channelId);
            break;
        case 'right':
            rightFeedIds = rightFeedIds.filter(id => id !== channelId);
            break;
    }
}

// Add event listener
checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        leftFeedIds.push('UCsXVk37bltHxD1rDPwtNM8Q');
    } else {
        removeFromFeed('UCsXVk37bltHxD1rDPwtNM8Q', 'left');
    }

    reloadFeeds();
});

function reloadFeeds() {
    fetchAllRSSFeeds(proxyUrl, rssUrl)
    .then(feedItems => {
        allFeedItems = feedItems;
        processFeed(feedItems, document.getElementById('searchBox').checked);
        fetchLaunches(proxyUrl, jsonRocketLaunches);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}


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
            channelName: entry.querySelector('author name, media\\:group media\\:credit')?.textContent,
            channelId: entry.querySelector('channelId')?.textContent,
            id: entry.querySelector('videoId')?.textContent,
            title: entry.querySelector('title')?.textContent,
            link: entry.querySelector('link')?.getAttribute('href'),
            published: entry.querySelector('published')?.textContent,
            thumbnail: entry.querySelector('thumbnail')?.getAttribute('url'),
            thumbnailWidth: entry.querySelector('thumbnail')?.getAttribute('width'),
            thumbnailHeight: entry.querySelector('thumbnail')?.getAttribute('height'),
            description: entry.querySelector('media\\:description, description')?.textContent
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


function processLeftFeed(feedItems) {
    const leftFeedContainer = document.getElementById('leftFeed');
    leftFeedContainer.innerHTML = '';
    

    let leftResults = []

    for (const channelKey in feedItems) {
        if (leftFeedIds.some(id => feedItems[channelKey].channelId.includes(id))) {
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

    listChannleNames(leftResults);
}

function processMiddleFeed(feedItems) {
    const miiddFeedContainer = document.getElementById('middleFeed');
    miiddFeedContainer.innerHTML = '';

    let middleResults = []

    for (const channelKey in feedItems) {
        if (middleFeedIds.some(id => feedItems[channelKey].channelId.includes(id))) {
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

    listChannleNames(middleResults);
}

function processRightFeed(feedItems) {
    const rightFeedContainer = document.getElementById('rightFeed');
    rightFeedContainer.innerHTML = '';

    let rightResults = []

    for (const channelKey in feedItems) {
        if (rightFeedIds.some(id => feedItems[channelKey].channelId.includes(id))) {
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

    listChannleNames(rightResults);
}

function listChannleNames(videos) {
    // Create a Set to remove duplicates
    const uniqueChannels = new Set(videos.map(video => video.channelName));
    
    // Convert back to array and log
    const channelList = Array.from(uniqueChannels);
    console.log('Channels:', channelList);
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

reloadFeeds();