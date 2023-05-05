const {checkNotificationExistence} = require('./controllers/notificationController');
const {createNotification} = require('./controllers/notificationController');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const MONGO_URL = 'mongodb+srv://npradmin:IwaAtlassaur49@nprobinson.7yutoqh.mongodb.net/CanadaCriminalLawyer';
const UserNotification = require('./models/userNotifications');
const User = require('./models/user');

const webPush = require("web-push");

// set VAPID keys
webPush.setVapidDetails(
    "mailto:tanner@nprobinson.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

async function startScraper() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB database');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log("StartScraper Invoked")
    const blogPosts = await scrapeSupremeAdvocacy();
    console.log(`blogPosts in JSON: ${JSON.stringify(blogPosts, null, 2)}`)

    for (const post of blogPosts) {
        const doesNotificationExist = await checkNotificationExistence(post.id);
        console.log(`Does notification exist ${doesNotificationExist}`)
        if (!doesNotificationExist) {
            const newNotification = await createNotification(formatPostData(post));
            // trigger notification process

            
            const unsentUserNotifications = await UserNotification.find({
                notificationId: newNotification._id,
                sent: false
            });

            // Send push notification to users and update UserNotification documents
            for (const userNotification of unsentUserNotifications) {
                await sendPushNotificationAndMarkSent(userNotification);
            }
        } else {
            console.log("Else statement invoked.")
        }
    }
    
    mongoose.connection.close();
    
    // Schedule the scraper to run every hour (use the appropriate cron syntax for your desired interval)
    //cron.schedule('0 * * * *', async () => {
        //console.log('Running scraper...');

        //const newPosts = await scrapeSupremeAdvocacy();

        // Check for new posts and trigger the notification process
        //for (const post of newPosts) {
            // Use a condition to determine whether the post is new (e.g., compare the post date to the last check date or check if the post exists in your database)
            //if (isNew(post)) {
                //sendNotification(post);
            //}
        //}
    //});
}

function formatPostData(post) {
    const postDocument = {
        type: "SCC Update",
        title: post.title,
        message: `New update from the SCC: ${post.description}`,
        url: post.link,
        articleID: post.id
    }
    console.log(`Formatted SCC Post: ${JSON.stringify(postDocument)}`);
    return postDocument;
}

async function scrapeSupremeAdvocacy() {
    const url = 'https://supremeadvocacy.ca/category/updates-from-the-scc/';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const articles = [];

        $('#left-area article').each((i, element) => {
            const id = $(element).attr('id');
            const link = $(element).find('a').first().attr('href');
            const title = $(element).find('h2.entry-title > a').text().trim();
            const date = $(element).find('p.post-meta span.published').text().trim();
            const description = $(element).children('p:not([class])').text().trim();

            articles.push({
                id,
                link,
                title,
                date,
                description
            });
        });

    console.log(`Articles scraped: ${articles}`);
    return articles;

    } catch(error) {
        console.error(`Error fetching new posts: ${error.message}`);
        return [];
    }
}

async function sendPushNotificationAndMarkSent(userNotification) {
    try {
        // Get the user's subscription object
        const user = await User.findById(userNotification.userId);
        const pushSubscription = user.pushSubscription;

        // Create the push notification payload
        const notificationPayload = {
            notification: {
                title: "New Update From The SCC",
                body: `userNotification.message`,
                //icon: "icon.png", // Replace with the path to your notification icon
            },
        };

        // Send push notification to the user
        await webPush.sendNotification(pushSubscription, JSON.stringify(notificationPayload));

        // Update UserNotification document
        userNotification.sent = true;
        userNotification.sentAt = new Date();
        await userNotification.save();
    } catch (error) {
        console.error("Error sending push notification:", error);
    }  
}


module.exports = startScraper;