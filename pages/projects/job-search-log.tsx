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

    // a function that takes in two dates and returns if they are in the same week or not
    function isSameWeek(d1: Date, d2: Date) {
        // Copy date so don't modify original
        d1 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()));
        d2 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d1.setUTCDate(d1.getUTCDate() + 4 - (d1.getUTCDay()||7));
        d2.setUTCDate(d2.getUTCDate() + 4 - (d2.getUTCDay()||7));
        // Get first day of year
        var yearStart1 = new Date(Date.UTC(d1.getUTCFullYear(),0,1));
        var yearStart2 = new Date(Date.UTC(d2.getUTCFullYear(),0,1));
        // Calculate full weeks to nearest Thursday
        var weekNo1 = Math.ceil(( ( (d1.getTime() - yearStart1.getTime()) / 86400000) + 1)/7)
        var weekNo2 = Math.ceil(( ( (d2.getTime() - yearStart2.getTime()) / 86400000) + 1)/7)
        // Return if same week
        return weekNo1 === weekNo2;
    }
    
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
                {jobData.map((job, index) => {
                    let isNewWeek = false;
                    let weekNum = 1;
                    // if the job is not the first job in the array, check if it is in the same week as the previous job using the isSameWeek function
                    if (index > 0) {
                        // if the job is not in the same week as the previous job, set isNewWeek to true
                        if (!isSameWeek(new Date(job.dateApplied), new Date(jobData[index - 1].dateApplied))) {
                            isNewWeek = true;
                            weekNum++;
                        }
                    }

                    
                    return (
                    <>
                        
                        {/* add conditional class for rejected applications */}
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
                        {/* if the job is in a new week, add a new row with the with the week number */}
                        {(isNewWeek || index==jobData.length-1) && <tr><td colSpan={5} className={styles.weekNumber}>Week {weekNum}</td></tr>}
                    </>
                )
                })}
                
            </tbody>
        </table>
        </main>
        </>
    )
}

