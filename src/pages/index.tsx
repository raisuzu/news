import Head from 'next/head';
import MainLayout from '../layouts';
import styles from '../styles/Home.module.scss';
import Article from '../components/article';
import Nav from '../components/nav';
import WeatherNews from '../components/weather-news';
import PickupArticle from '../components/pickup-article';

interface Article {
  author: string;
  title: string;
  publishedAt: string;
  url: string;
  urlToImage: string;
}

interface WeatherNewsType {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
  }>;
}

interface HomeProps {
  topArticles: Article[];
  weatherNews: WeatherNewsType;
  pickupArticles: Article[];
}

export default function Home(props: HomeProps) {
  console.log('Home props:', props);
  return (
    <MainLayout>
      <Head>
        <title>卒制 News</title>
      </Head>
      <div className={styles.contents}>
        <div className={styles.nav}>
          <nav>
            <Nav />
          </nav>
        </div>
        <div className={styles.blank} />
        <div className={styles.main}>
          <Article title="headline" articles={props.topArticles} />
        </div>
        <div className={styles.aside}>
          <WeatherNews weatherNews={props.weatherNews} />
          <PickupArticle articles={props.pickupArticles} />
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps = async () => {
  try {
    const pageSize = 5;
    const topRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&apiKey=0f432f32bcda4f35badf3787294f9fa3`,
    );

    if (!topRes.ok) {
      throw new Error(`Failed to fetch articles: ${topRes.statusText}`);
    }

    const topJson = await topRes.json();
    const topArticles: Article[] = topJson?.articles || [];
    console.log('Top Articles:', topArticles);

    const lat = 35.4122;
    const lon = 139.413;
    const exclude = 'hourly,minutely';
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&exclude=${exclude}&appid=c5d1aa0a74c04ea4830a28f14ea81aee`,
    );

    if (!weatherRes.ok) {
      throw new Error(`Failed to fetch weather: ${weatherRes.statusText}`);
    }

    const weatherJson = await weatherRes.json();
    const weatherNews: WeatherNewsType = weatherJson;
    console.log('Weather News:', weatherNews);

    const keyword = 'google';
    const sortBy = 'popularity';
    const pickupPageSize = 5;
    const pickupRes = await fetch(
      `https://newsapi.org/v2/everything?q=${keyword}&sortBy=${sortBy}&pageSize=${pickupPageSize}&apiKey=0f432f32bcda4f35badf3787294f9fa3`,
    );

    if (!pickupRes.ok) {
      throw new Error(
        `Failed to fetch pickup articles: ${pickupRes.statusText}`,
      );
    }

    const pickupJson = await pickupRes.json();
    const pickupArticles: Article[] = pickupJson?.articles || [];
    console.log('Pickup Articles:', pickupArticles);

    return {
      props: {
        topArticles,
        weatherNews,
        pickupArticles,
      },
      revalidate: 60 * 10,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        topArticles: [],
        weatherNews: null,
        pickupArticles: [],
      },
    };
  }
};
