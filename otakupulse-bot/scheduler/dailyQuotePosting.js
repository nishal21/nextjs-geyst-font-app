import cron from 'node-cron';
import { readJSON } from '../utils/jsonStorage.js';
import { Client } from 'discord.js';

export function startDailyQuotePosting(client) {
  // Run every day at 10 AM server time
  cron.schedule('0 10 * * *', async () => {
    try {
      const quotes = readJSON('quotes.json');
      if (!quotes || quotes.length === 0) return;

      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];

      const channelId = process.env.DAILY_QUOTE_CHANNEL_ID;
      const channel = client.channels.cache.get(channelId);
      if (!channel) return;

      const embed = {
        color: 0x0099ff,
        title: 'Daily Anime Quote',
        description: `"${quote.quote}"`,
        fields: [
          { name: 'Anime', value: quote.anime || 'Unknown', inline: true },
          { name: 'Character', value: quote.character || 'Unknown', inline: true },
        ],
        footer: { text: 'Powered by OtakuPulse' },
      };

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error in daily quote posting:', error);
    }
  });
}
