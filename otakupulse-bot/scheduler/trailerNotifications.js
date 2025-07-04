import cron from 'node-cron';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // User must set this in .env
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

export function startTrailerNotifications(client) {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    try {
      // Load the list of subscribed anime from JSON (optional enhancement)
      // For simplicity, we will just search for trailers of popular anime or all subscribed anime

      // Example: Search for trailers of some anime (this can be improved to use subscriptions)
      const animeList = ['Naruto', 'One Piece', 'Attack on Titan'];

      for (const anime of animeList) {
        const params = {
          key: YOUTUBE_API_KEY,
          q: `${anime} trailer`,
          part: 'snippet',
          maxResults: 1,
          type: 'video',
          order: 'date',
        };

        const response = await axios.get(YOUTUBE_SEARCH_URL, { params });
        const items = response.data.items;
        if (items && items.length > 0) {
          const video = items[0];
          const videoId = video.id.videoId;
          const title = video.snippet.title;
          const thumbnail = video.snippet.thumbnails.high.url;
          const url = `https://www.youtube.com/watch?v=${videoId}`;

          // Post to a designated channel
          const channelId = process.env.TRAILER_NOTIFICATION_CHANNEL_ID;
          const channel = client.channels.cache.get(channelId);
          if (channel) {
            channel.send({
              content: `New trailer for **${anime}**!`,
              embeds: [{
                title,
                url,
                image: { url: thumbnail },
              }],
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in trailer notifications:', error);
    }
  });
}
