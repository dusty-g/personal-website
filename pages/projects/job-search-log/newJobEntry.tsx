import Head from "next/head";
import JobSearchLogEntry from "src/components/jobSearchEntry";
import Nav from "src/components/nav";

export default function NewJobEntry() {
    return (
        <>
        <Head>
            <title>Job Application Entry</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className="main">
            <JobSearchLogEntry mode="add"/>
        </main>
        
        </>
        
    )
}
