import { GetStaticPaths, GetStaticProps } from 'next';
import { PostData, getAllPostIds, getPostData } from 'utils/posts';

export default function Post({
  postData,
}: {
  postData: PostData;
}) {
  return (
    <div>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
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
  
