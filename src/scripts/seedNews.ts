import dbConnect from '../lib/mongoose';
import News from '../models/News';


async function seedNews() {
  await dbConnect();

  const predefinedNews = [
    {
      title: "Tolmin Football Club Wins Local Championship",
      content: "Tolmin FC has secured the local championship after an exciting final match.",
      publishedAt: new Date('2025-05-01T10:00:00Z'),
      author: "Admin",
    },
    {
      title: "Upcoming Match Scheduled for Next Sunday",
      content: "Tolmin FC will face their rivals in the stadium next Sunday. Fans are encouraged to attend.",
      publishedAt: new Date('2025-05-10T12:00:00Z'),
      author: "Admin",
    },
  ];

  for (const newsItem of predefinedNews) {
    // Check if the news item with the same title exists to avoid duplicates
    const exists = await News.findOne({ title: newsItem.title });
    if (!exists) {
      await News.create(newsItem);
      console.log(`Inserted news: ${newsItem.title}`);
    } else {
      console.log(`News already exists: ${newsItem.title}`);
    }
  }

  process.exit(0);
}

seedNews().catch((err) => {
  console.error(err);
  process.exit(1);
});
