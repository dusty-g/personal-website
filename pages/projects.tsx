import Nav from "src/components/nav";
import Head from "next/head";
//placeholder for projects page
export default function Projects() {
    return (
        <>
        <Head>
            <title>Projects</title>
            <meta name="description" content="Personal website for Dusty Galindo" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav />
        <main className="main">
            <h1>Projects</h1>
            {/* list of projects */}
            <ul>
                <li>This website! 
                    <ul>
                        <li>Built using Next.js</li>
                        <li>Deployed to Google App Engine</li>
                    </ul></li>
                <li>🚧todo🚧</li>
                <li>Open to suggestions</li>
            </ul>
        
        </main>
        </>
    );
    }
