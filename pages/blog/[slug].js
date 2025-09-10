// pages/blog/[slug].js
import { useMemo } from 'react';
import Head from 'next/head';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '../../utils/mdx';
import SumOfOddsVisualizer from '../../components/SumOfOddsVisualizer';

import Nav from '../../components/nav';
import dynamic from 'next/dynamic';

// import ExampleButtonHexConfetti from '../../components/ExampleButtonHexConfetti';
const ExampleButtonHexConfetti = dynamic(
  () => import('../../components/ExampleButtonHexConfetti'),
  { ssr: false }
);
/**
 * If you have custom components you want to embed in MDX
 * usage, define them here and pass as `components` to <MDXRemote />
 */
const MDXComponents = {
  // Example:
  // CustomButton: (props) => <button style={{ background: 'tomato' }} {...props} />,
  SumOfOddsVisualizer,
  ExampleButtonHexConfetti,
};

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
  const posts = getAllPosts();
  // Map post slugs to the `[slug]` param
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));

  return {
    paths,
    fallback: false, // or 'blocking' if you prefer
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { content, meta } = getPostBySlug(slug);

  // Convert MDX content to serialized form
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      // Add more remark/rehype plugins here if needed
    },
    scope: meta,
  });

  return {
    props: {
      source: mdxSource,
      meta,
    },
  };
}
