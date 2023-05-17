import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getSortedPostsData, PostData } from '../utils/posts';

export default function Blog({ allPostsData }: { allPostsData: PostData[] }) {
  return (
    <div>
      <h1>My Blog</h1>
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
    </div>
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
