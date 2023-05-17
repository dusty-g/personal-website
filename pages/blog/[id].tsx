import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Nav from 'src/components/nav';
import { PostData, getAllPostIds, getPostData } from 'utils/posts';

export default function Post({
  postData,
}: {
  postData: PostData;
}) {
  return (
    <>
        <Head>
            <title>{postData.title}</title>
            <meta name="description" content="Personal website for Dusty Galindo" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className='main'>
            <div>
            <h1>{postData.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </div>
        </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
      paths,
      fallback: false,
    };
  };
  
  export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.id as string);
    return {
      props: {
        postData,
      },
    };
  };
  
