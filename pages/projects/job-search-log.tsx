import Nav from 'src/components/nav'
import Head from 'next/head'
// import styles
import styles from 'src/styles/JobSearchLog.module.css'
import { useEffect, useState } from 'react';
// import firebase
import { ref, onValue } from "firebase/database";
//import db from _app.tsx
import { db } from 'src/pages/_app'

export default function JobSearchLog() {
    // get data from firebase. need to set types. fixed in next line
    const [jobData, setJobData] = useState<any[]>([]);
    useEffect(() => {
        // get data from firebase
        const dbRef = ref(db, 'jobs');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            const jobData = [];
            for (let key in data) {
                jobData.push({ id: key, ...data[key] });
            }
            setJobData(jobData);
        });
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
        {/* table of job applications retrieved from firebase */}
        <table className={styles.jobTable}>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Job Title</th>
                    <th>Job Description</th>
                    <th>Date Applied</th>
                    <th>Application Status</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                
        
                {/* get data from firebase */}
                {jobData.map((job) => (
                    // add conditional class for rejected applications
                    <tr key={job.id} className={job.applicationStatus === 'rejected' ? styles.rejected : ''}>
                        <td>{job.companyName}</td>
                        <td>{job.jobTitle}</td>
                        <td>{job.jobDescription}</td>
                        <td>{job.dateApplied}</td>
                        <td>{job.applicationStatus}</td>
                        <td>{job.notes}</td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        </main>
        </>
    )
}

