import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getSortedPostsData, PostData } from '../utils/posts';
import Head from 'next/head';
import Nav from 'src/components/nav';

export default function Blog({ allPostsData }: { allPostsData: PostData[] }) {
  return (
    <>
    <Head>
        <title>Blog</title>
        <meta name="description" content="Personal website for Dusty Galindo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
    <main className='main'>
      <h1>Blog</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/blog/${id}`}>
              {title}
            </Link>
            <br />
            <small>{date}</small>
          </li>
        ))}
      </ul>
    </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
