// blog page
import Head from 'next/head'
import Link from 'next/link'
import Nav from 'src/components/nav'

export default function Blog() {
    return (
        <>
        <Head>
            <title>Blog</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <h1>Blog</h1>
        {/* list of blog posts */}
        <ul>
            <li><Link href="/blog/report">test post</Link></li>
        </ul>
        </>
    )
    }
