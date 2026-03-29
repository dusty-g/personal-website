export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const secret = req.query.secret || req.headers['x-revalidation-secret'];
  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  try {
    const revalidated = [];

    // Extract affected MDX slugs from GitHub push webhook payload
    const commits = req.body?.commits || [];
    const affectedFiles = new Set();
    for (const commit of commits) {
      for (const file of [...(commit.added || []), ...(commit.modified || [])]) {
        if (file.startsWith('blogposts/') && file.endsWith('.mdx')) {
          affectedFiles.add(file.replace('blogposts/', '').replace('.mdx', ''));
        }
      }
    }

    // Revalidate each affected post
    for (const slug of affectedFiles) {
      await res.revalidate(`/blog/${slug}`);
      revalidated.push(`/blog/${slug}`);
    }

    // Always revalidate the index
    await res.revalidate('/blog');
    revalidated.push('/blog');

    return res.json({ revalidated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
