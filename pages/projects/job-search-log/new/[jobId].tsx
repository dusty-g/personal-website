import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import JobSearchLogEntry from "src/components/jobSearchEntry";
import Nav from "src/components/nav";
// todo: change this path name from new/ to update/
export default function UpdateJobEntry() {
    // get the jobId from the URL
    const router = useRouter();
    const { jobId } = router.query;
    
    return (
        <>
        <Head>
            <title>Update Job Application Entry</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className="main">
        <JobSearchLogEntry mode="update" jobSearchEntryId={jobId}/>
        </main>
        
        </>

        
    )
}