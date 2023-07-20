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
import React from 'react';

export default function JobSearchLog() {
    // get data from firebase. need to set types. fixed in next line
    const [jobData, setJobData] = useState<any[]>([]);
    useEffect(() => {
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

    // a function that takes in two dates and returns if they are in the same week or not. Week starts on Sunday
    function isSameWeek(d1: Date, d2: Date) {
        // use days since March 19th 2023 mod 7 to get the week of unemployment and compare
        const week1 = Math.floor((d1.getTime() - new Date('March 19, 2023').getTime()) / (1000 * 60 * 60 * 24 * 7));
        const week2 = Math.floor((d2.getTime() - new Date('March 19, 2023').getTime()) / (1000 * 60 * 60 * 24 * 7));
        return week1 === week2;
    }
    // calculate weeks since March 19th 2023
    function unemploymentWeekNumber(date: Date) {
        return Math.floor((date.getTime() - new Date('2023-03-19').getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
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
        <div className={styles.description}>
        <p>This is a list of jobs I&apos;ve applied to since beginning my job search on March 19th, 2023.</p>
        
        <p>This project uses Firebase Realtime Database, which is a NoSQL database. The React library for Firebase is used to retrieve data from the database and display it on the page. <br></br>Google Authentication is used to sign in with a Google account. The database is configured to only allow a specific account (mine) to write to the database.</p>
        <p>New entries to the database are added by using the ChatGPT API to parse job descriptions <Link href="/projects/job-search-log/newGptJobEntry">here</Link>.</p>

        
        </div>
        {/* add a color key for the application statuses */}
        <p className={styles.key}><span className={styles.interview}>Moving Forward</span> <span className={styles.rejected}>Rejected</span> <span className={styles.stale}>No response &gt; 21 days</span></p>
        {/* table of job applications retrieved from firebase */}
        <table className={styles.jobTable}>
            <thead>
                <tr key={"header"}>
                    <th>Company</th>
                    <th>Job Title</th>
                    {/* <th>Job Description</th> */}
                    <th>Date Applied</th>
                    <th>Application Status</th>
                    <th>Salary</th>
                </tr>
            </thead>
            <tbody>
                
        
                {/* get data from firebase */}
                {jobData.map((job, index) => {
                    let isNewWeek = false;
                    let weekNum = unemploymentWeekNumber(new Date(job.dateApplied))
                    // if the job is not the first job in the array, check if it is in the same week as the previous job using the isSameWeek function
                    if (index > 0) {
                        // if the job is not in the same week as the previous job, set isNewWeek to true
                        if (!isSameWeek(new Date(job.dateApplied), new Date(jobData[index - 1].dateApplied))) {
                            isNewWeek = true;
                        }
                    }
                    let rowClass = '';
                    if (job.applicationStatus === 'Rejected') {
                        rowClass = styles.rejected;
                    } else if (job.applicationStatus === 'Interviewing' || job.applicationStatus === 'Completed Assessment') {
                        rowClass = styles.interview;
                    }
                    // if it has been more than 20 days since date applied, add a class to the row
                    else if (new Date(job.dateApplied).getTime() + (1000 * 60 * 60 * 24 * 21) < new Date().getTime()) {
                        rowClass = styles.stale;
                    }
                
                    
                    return (
                    <React.Fragment key={job.id + "fragment"}>
                        
                        {(isNewWeek) && <tr key={"week" + weekNum+1}><td colSpan={5} className={styles.weekNumber}>&#8593;&nbsp;Week {weekNum + 1}&nbsp;&#8593;</td></tr>}
                        {/* add conditional class for rejected applications */}
                        <tr key={job.id} className={rowClass}>
                            <td>{job.companyName}</td>
                            {/* add a link to job.url */}
                            {/* <td>{job.jobTitle}</td> */}
                            <td><Link href={job.url}>{job.jobTitle}</Link></td>
                            {/* <td>{job.jobDescription}</td> */}
                            <td>{job.dateApplied}</td>
                            <td><Link href={"/projects/job-search-log/new/" + job.id}>{job.applicationStatus}</Link></td>
                            <td className={styles.wordBreak}>{job.salary}</td>
                        </tr>
                        {/* add a week number (week 1) row after the last job in the array */}
                        {(index==jobData.length-1) && <tr key="week1"><td colSpan={5} className={styles.weekNumber}>&#8593;&nbsp;Week 1&nbsp;&#8593;</td></tr>}

                    </React.Fragment>
                )
                })}
                
            </tbody>
        </table>
        </main>
        </>
    )
}

