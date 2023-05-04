const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

export default function startScraper() {
    // Schedule the scraper to run every hour (use the appropriate cron syntax for your desired interval)
    cron.schedule('0 * * * *', async () => {
        console.log('Running scraper...');

        const newPosts = await fetchNewPosts();

        // Check for new posts and trigger the notification process
        for (const post of newPosts) {
            // Use a condition to determine whether the post is new (e.g., compare the post date to the last check date or check if the post exists in your database)
            if (isNew(post)) {
                sendNotification(post);
            }
        }
    });
}

function sendNotification(post) {
    // Implement your notification logic here
    // e.g., create a new document in the notifications collection and send a push notification to the user's phone
    console.log('Sending notification:', post.title);
}

async function fetchNewPostsSupremeAdvocacy() {
    const url = 'https://supremeadvocacy.ca/blog/';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const newPosts = [];

        $('div.post').each((index, element) => {
            const title = $(element).find('h2 a').text();
            const link = $(element).find('h2 a').attr('href');
            const date = $(element).find('.post-date').text();

            newPosts.push({ title, link, date });
        });

        console.log(`New Posts: ${newPosts}`);
        return newPosts;

    } catch(error) {
        console.error(`Error fetching new posts: ${error.message}`);
        return [];
    }
}