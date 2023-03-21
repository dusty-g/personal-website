import Nav from 'src/components/nav'
import Head from 'next/head'
// import styles
import styles from 'src/styles/JobSearchLog.module.css'

export default function JobSearchLog() {
    
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
                    <th>Date Applied</th>
                    <th>Application Status</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {/* get data from firebase */}
                <tr>
                    <td>company name</td>
                    <td>job title</td>
                    <td>date applied</td>
                    <td>application status</td>
                    <td>notes</td>
                </tr>
                
            </tbody>
        </table>

        </main>
        </>
    )
}

