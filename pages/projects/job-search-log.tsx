import Nav from 'src/components/nav'
import Head from 'next/head'
// import styles
import styles from 'src/styles/JobSearchLog.module.css'
import { useEffect, useState } from 'react';
// import firebase
import { ref, onValue } from "firebase/database";
//import db from _app.tsx
import { db } from 'src/pages/_app'
import Link from 'next/link';

export default function JobSearchLog() {
    // get data from firebase. need to set types. fixed in next line
    const [jobData, setJobData] = useState<any[]>([]);
    useEffect(() => {
        
        // const dbRef = ref(db, 'jobs');
        // onValue(dbRef, (snapshot) => {
        //     const data = snapshot.val();
        //     const jobData = [];
        //     for (let key in data) {
        //         jobData.push({ id: key, ...data[key] });
        //     }
        //     setJobData(jobData);
        // });

        // get data from firebase sorted by dateApplied
        const dbRef = ref(db, 'jobs');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            const jobData = [];
            for (let key in data) {
                jobData.push({ id: key, ...data[key] });
            }
            // sort by dateApplied
            jobData.sort((a, b) => {
                return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
            });
            setJobData(jobData);
        }
        );
    }, []);

    
    return (
        <>
        <Head>
            <title>Job Search Log</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        
        <main className='main'>
        <h1>Job Search Log</h1>
        {/* description */}
        <p>I am using Google Firebase Realtime Database, which is a NoSQL database. I am using the React library for Firebase to retrieve data from the database and display it on the page.</p>
        <p>I add new entries to the database using a form on the <Link href="/projects/job-search-log/new">Create New Job Log</Link> page. I use Google Authentication to sign in with my Google account. The database is configured to only allow my account to write to the database.</p>
        {/* table of job applications retrieved from firebase */}
        <table className={styles.jobTable}>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Job Title</th>
                    {/* <th>Job Description</th> */}
                    <th>Date Applied</th>
                    <th>Application Status</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                
        
                {/* get data from firebase */}
                {jobData.map((job) => (
                    // add conditional class for rejected applications
                    <tr key={job.id} className={job.applicationStatus === 'Rejected' ? styles.rejected : ''}>
                        <td>{job.companyName}</td>
                        {/* add a link to job.url */}
                        {/* <td>{job.jobTitle}</td> */}
                        <td><Link href={job.url}>{job.jobTitle}</Link></td>
                        {/* <td>{job.jobDescription}</td> */}
                        {/* format date to just month/day, no year */}
                        <td>{new Date(job.dateApplied).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</td>
                        <td>{job.applicationStatus}</td>
                        <td className={styles.wordBreak}>{job.notes}</td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        </main>
        </>
    )
}

