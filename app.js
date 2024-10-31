const rssUrl = ['https://www.youtube.com/feeds/videos.xml?channel_id=UCSUu1lih2RifWkKtDOJdsBA',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UC6uKrU_WqJ1R2HMTY3LIx5Q'];

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
        console.log(feedPromises);
        
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
            id: entry.querySelector('videoId')?.textContent,
            title: entry.querySelector('title')?.textContent,
            link: entry.querySelector('link')?.getAttribute('href'),
            published: entry.querySelector('published')?.textContent,
            thumbnail: entry.querySelector('thumbnail')?.getAttribute('url'),
            thumbnailWidth: entry.querySelector('thumbnail')?.getAttribute('width'),
            thumbnailHeight: entry.querySelector('thumbnail')?.getAttribute('height')
        });
    }

    console.log("feedItems");
    return feedItems;
}

function processFeed(feedItems) {
    // Get the feed container
    const feedContainer = document.getElementById('feed');
    
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
    };

    // Process each feed item
    feedItems.forEach(item => {
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

        // Create published date span
        const published = document.createElement('span');
        published.textContent = formatDate(item.published);
        published.className = 'date';

        const thumbnail = document.createElement("img");
        thumbnail.src = item.thumbnail;

        // Assemble the card
        title.appendChild(link);
        card.appendChild(thumbnail);
        card.appendChild(title);
        card.appendChild(published);
        feedContainer.appendChild(card);
    });
}

const proxyUrl = 'https://corsproxy.io/';
// Use the new fetchAllRSSFeeds function instead of the single feed approach
fetchAllRSSFeeds(proxyUrl, rssUrl)
    .then(feedItems => {
        processFeed(feedItems);
        console.log(feedItems);
    })
    .catch(error => {
        console.error('Error:', error);
    });
