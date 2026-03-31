// pages/blog/[slug].js
import Head from 'next/head';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '../../utils/mdx';
import { fetchPostBySlug, fetchAllPostsMeta } from '../../utils/github-mdx';
import MDXComponents from '../../utils/mdx-components';
import Nav from '../../components/nav';

export default function BlogPost({ source, meta }) {
   
  // If needed, you could manipulate the MDX source or props here
  return (
    <>
      <Head>
        <title>{meta.title || 'Untitled Post'}</title>
        <meta name="description" content={meta.title || 'Blog post'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div style={{ padding: '2rem' }}>
        <h1>{meta.title || 'Untitled Post'}</h1>
        {meta.date && (
          <p style={{ color: '#999' }}>
            {meta.date}
          </p>
        )}
        <article style={{ marginTop: '2rem' }}>
          <MDXRemote {...source} components={MDXComponents} />
        </article>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // In production, pre-render known posts from GitHub; new posts use fallback
  // In development, use local filesystem for fast iteration
  const useRemote = process.env.USE_REMOTE_MDX === 'true';

  let slugs;
  if (useRemote) {
    const posts = await fetchAllPostsMeta();
    slugs = posts.map((p) => p.slug);
  } else {
    const posts = getAllPosts();
    slugs = posts.map((p) => p.slug);
  }

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const useRemote = process.env.USE_REMOTE_MDX === 'true';

  let content, meta;
  if (useRemote) {
    const post = await fetchPostBySlug(slug);
    if (!post) return { notFound: true };
    content = post.content;
    meta = post.meta;
  } else {
    const post = getPostBySlug(slug);
    content = post.content;
    meta = post.meta;
  }

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
    scope: meta,
  });

  return {
    props: { source: mdxSource, meta },
    revalidate: 604800,
  };
}
