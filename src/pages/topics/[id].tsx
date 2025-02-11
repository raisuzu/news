import Head from 'next/head';
import { useRouter } from 'next/router';
import Article from '../../components/article';
import Nav from '../../components/nav';
import MainLayout from '../../layouts/index';
import styles from '../../styles/Home.module.scss';

function Topic(props) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <Head>
        <title>Simple News - {props.title.toUpperCase()}</title>
      </Head>
      <div className={styles.contents}>
        <div className={styles.nav}>
          <nav>
            <Nav />
          </nav>
        </div>
        <div className={styles.blank} />
        <div className={styles.main} style={{ marginRight: '10%' }}>
          <Article title={props.title} articles={props.topicArticles} />
        </div>
      </div>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const topicRes = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=${params.id}&country=jp&apiKey=0f432f32bcda4f35badf3787294f9fa3`,
  );
  const topicJson = await topicRes.json();
  const topicArticles = await topicJson.articles;

  const title = params.id;

  return {
    props: { topicArticles, title },
    revalidate: 60 * 10,
  };
}

export default Topic;
