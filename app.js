const rssUrl = ['https://www.youtube.com/feeds/videos.xml?channel_id=UCSUu1lih2RifWkKtDOJdsBA',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UC6uKrU_WqJ1R2HMTY3LIx5Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCy6Q9UCG7Wa-N7nht2BFrHA'];

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

function parseRSS(rssText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, 'text/xml');
    return xmlDoc;
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

document.getElementById('searchBox').addEventListener('keyup', function () {
    processFeed(allFeedItems, this.value.toLowerCase());
});

// let allFeedItems = [];

function processFeed(feedItems, isSearch) {
    if (isSearch) {
        processSearchFeed(feedItems, isSearch)
    }
    else {
        processLeftFeed(feedItems)
        processMiddleFeed(feedItems)
        processRightFeed(feedItems)
    }







    // const SearchBox = document.createElement('input');
    // SearchBox.type = 'SearchBox';
    // SearchBox.id = 'SearchBox-${uten.id}';

    


    // console.log(feedItems);


    // if (isSearch) {

    // }
    // else {

    // }
}

function processSearchFeed(feedItems, isSearch) {
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

document.getElementById('searchBox').addEventListener('change', function () {
    processFeed(allFeedItems, this.checked);
});


const proxyUrl = 'https://corsproxy.io/';

fetchAllRSSFeeds(proxyUrl, rssUrl)
    .then(feedItems => {
        allFeedItems = feedItems;
        processFeed(feedItems, document.getElementById('searchBox').checked);
    })
    .catch(error => {
        console.error('Error:', error);
    });
