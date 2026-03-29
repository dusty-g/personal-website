// pages/blog/index.js
import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../utils/mdx';
import { fetchAllPostsMeta } from '../../utils/github-mdx';
import Nav from '../../components/nav';

export default function BlogIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Blog posts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div style={{ padding: '2rem' }}>
        <h1>Blog</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug} style={{ marginBottom: '1rem' }}>
              <Link href={`/blog/${post.slug}`}>
                {post.title ? post.title : post.slug}
              </Link>
              {post.date && (
                <span style={{ marginLeft: '0.5rem', color: '#999' }}>
                  {post.date} {/* Render date string directly */}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const useRemote = process.env.USE_REMOTE_MDX === 'true';

  let posts;
  if (useRemote) {
    posts = await fetchAllPostsMeta();
  } else {
    posts = getAllPosts().map(({ slug, title, date }) => ({ slug, title, date }));
  }

  return {
    props: { posts },
    revalidate: 300,
  };
}
