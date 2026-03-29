import matter from 'gray-matter';

const GITHUB_OWNER = process.env.GITHUB_CONTENT_OWNER || 'dusty-g';
const GITHUB_REPO = process.env.GITHUB_CONTENT_REPO || 'personal-website';
const GITHUB_BRANCH = process.env.GITHUB_CONTENT_BRANCH || 'main';
const CONTENT_PATH = 'blogposts';

function githubHeaders() {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchRawFile(filePath) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      ...githubHeaders(),
      Accept: 'application/vnd.github.raw',
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

export async function fetchPostBySlug(slug) {
  const raw = await fetchRawFile(`${CONTENT_PATH}/${slug}.mdx`);
  if (!raw) return null;

  const { data, content } = matter(raw);
  return { slug, meta: data, content };
}

export async function fetchAllPostsMeta() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, { headers: githubHeaders() });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const files = await res.json();
  const mdxFiles = files.filter((f) => f.name.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.name.replace(/\.mdx$/, '');
      const raw = await fetchRawFile(`${CONTENT_PATH}/${file.name}`);
      if (!raw) return null;

      const { data } = matter(raw);
      return { slug, title: data.title || slug, date: data.date || null };
    })
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
