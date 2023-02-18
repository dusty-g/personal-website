import Nav from "src/components/nav";
import Head from "next/head";
import Link from "next/link";
//placeholder for projects page
export default function Projects() {
    return (
        <>
        <Head>
            <title>Projects</title>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5213545915383529"
     crossOrigin="anonymous"></script>
            <meta name="description" content="Personal website for Dusty Galindo" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav />
        <main className="main">
            <h1>Projects</h1>
            {/* list of projects */}
            <ul>
                <li><Link href="projects/fizzbuzz">fizzbuzz</Link></li>
                <li>This website! 
                    <ul>
                        <li>Built using Next.js</li>
                        <li>Deployed to Google App Engine</li>
                    </ul></li>
                <li>Open to suggestions</li>
            </ul>
        
        </main>
        </>
    );
    }
