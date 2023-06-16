//this will be a form for adding or updating a job search entry to the firebase database

import React, { useEffect, useState } from "react";
// import firebase
import { push, ref, update } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";

import { db } from 'src/pages/_app'
import Head from "next/head";
import Nav from "src/components/nav";
import { useRouter } from "next/router";
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, User } from "firebase/auth";
import router from "next/router";
// import styles
import styles from 'src/styles/NewJobSearchLog.module.css'


const provider = new GoogleAuthProvider();
// create a custom hook to get the firebase auth instance
export function useAuth() : Auth | null{
    const [auth, setAuth] = useState<Auth | null>(null);
  
    useEffect(() => {
      // initialize firebase auth only once
      if (!auth) {
        setAuth(getAuth());
      }
    }, [auth]);
  
    return auth;
  }

  // should take in "mode" as a prop, which will be either "add" or "update"
  // if mode is "add", then the form will be blank
  // if mode is "update", then the form will be pre-populated with the existing data
  // should take in "jobSearchEntry" as a prop, which will be the existing data if mode is "update"
  // should take in "jobSearchEntryId" as a prop, which will be the id of the existing data if mode is "update"
  // but if mode is "add", then jobSearchEntryId will be null
    export default function JobSearchLogEntry({mode, jobSearchEntryId, jobData}: {mode: string, jobSearchEntryId?: string | string[], jobData?: any}) {
    const auth = useAuth();
    //subscribe to auth state changes
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged((user) => {
            if (user) {
                // user is signed in
                setUser(user);
            } else {
                // user is signed out
                setUser(null);
            }
        });
        return unsubscribe;
    }, [auth]);
   
    // get database reference if mode is "update"
    const databaseRef = mode === "update" ? ref(db, `jobs/${jobSearchEntryId}`) : null;
    // Use the useObjectVal hook to get the data, loading indicator, and error object
    const [data, loading, error] = useObjectVal<any>(databaseRef);
    
    // set state for form data
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [dateApplied, setDateApplied] = useState('');
    const [applicationStatus, setApplicationStatus] = useState('');
    const [salary, setSalary] = useState('');
    // if mode is "update", then pre-populate the form with the existing data
    useEffect(() => {
      if(!loading){
        if(mode === "update"){
            setCompanyName(data.companyName);
            setJobTitle(data.jobTitle);
            setJobUrl(data.url);
            setJobDescription(data.jobDescription);
            setDateApplied(data.dateApplied);
            setApplicationStatus(data.applicationStatus);
            setSalary(data.salary);
          } 
      }  
      
    }, [data]);
    // if mode is "gpt", the pre-populate the form with the jobData data
    useEffect(()=>{
        if(mode === "gpt"){
            if(jobData){
                console.log(jobData)
                setCompanyName(jobData.companyName);
                setJobTitle(jobData.jobTitle);
                setJobUrl(jobData.jobDescription);
                setJobDescription(jobData.applicationStatus);
                setSalary(jobData.salary)
            }
            

        }
    }, [jobData]);
    
    // set state for form validation
    const [companyNameError, setCompanyNameError] = useState('');
    const [jobTitleError, setJobTitleError] = useState('');
    const [jobUrlError, setJobUrlError] = useState('');
    const [jobDescriptionError, setJobDescriptionError] = useState('');
    const [dateAppliedError, setDateAppliedError] = useState('');
    const [applicationStatusError, setApplicationStatusError] = useState('');
    const [salaryError, setsalaryError] = useState('');
    // set state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    // set state for form submission success
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // handle form submission
     // handle form submission
     const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      // validate form
      setCompanyNameError('');
      setJobTitleError('');
      setJobUrlError('');
      setJobDescriptionError('');
      setDateAppliedError('');
      setApplicationStatusError('');
      setsalaryError('');
      // set error state if form is invalid
      if (companyName === '') {
          setCompanyNameError('Company Name is required');
      }
      if (jobTitle === '') {
          setJobTitleError('Job Title is required');
      }
      if (jobUrl === '') {
          setJobUrlError('Job URL is required');
      }
      if (jobDescription === '') {
          setJobDescriptionError('Job Description is required');
      }
      if (dateApplied === '') {
          setDateAppliedError('Date Applied is required');
      }
      if (applicationStatus === '') {
          setApplicationStatusError('Application Status is required');
      }
      
      // commented out because salary are not required
      // if (salary === '') {
      //     setsalaryError('salary is required');
      // }
      // if form is valid, then submit form
      if (companyName && jobTitle && jobUrl && jobDescription && dateApplied && applicationStatus) {
        // set isSubmitting to true to disable form
        setIsSubmitting(true);
        // set submissionError to empty string
        setSubmissionError('');
        // submit form to create or update job search entry
        if(mode === "add" || mode === "gpt"){
          const newJob = {
            companyName: companyName,
            jobTitle: jobTitle,
            url: jobUrl,
            jobDescription: jobDescription,
            dateApplied: dateApplied,
            applicationStatus: applicationStatus,
            salary: salary
        };
        // push new job to firebase database
        push(ref(db, 'jobs'), newJob)
        .then(() => {
            // set isSubmitting to false to enable form
            setIsSubmitting(false);
            // set submissionSuccess to true to display success message
            setSubmissionSuccess(true);
            // reset form
            setCompanyName('');
            setJobTitle('');
            setJobUrl('');
            setJobDescription('');
            setDateApplied('');
            setApplicationStatus('');
            setSalary('');
        }
        ).catch((error) => {
          // set isSubmitting to false to enable form
          setIsSubmitting(false);
          // set submissionError to error message
          setSubmissionError(error.message);
      }
      );
      // reset form
      setCompanyName('');
      setJobTitle('');
      setJobUrl('');
      setJobDescription('');
      setDateApplied('');
      setApplicationStatus('');
      setSalary('');
      // redirect to job search log page
      router.push('/projects/job-search-log');
    } else if(mode === "update"){
      // update existing job search entry
      const updatedJob = {
        companyName: companyName,
        jobTitle: jobTitle,
        url: jobUrl,
        jobDescription: jobDescription,
        dateApplied: dateApplied,
        applicationStatus: applicationStatus,
        salary: salary
    };
    // update existing job in firebase database
    update(ref(db, `jobs/${jobSearchEntryId}`), updatedJob)
    .then(() => {
        // set isSubmitting to false to enable form
        setIsSubmitting(false);
        // set submissionSuccess to true to display success message
        setSubmissionSuccess(true);
    }
    ).catch((error) => {
      // set isSubmitting to false to enable form
      setIsSubmitting(false);
      // set submissionError to error message
      setSubmissionError(error.message);
    }
    );
    // redirect to job search log page
    router.push('/projects/job-search-log');
  }
  
}
};
function signIn(): void {
  // sign in with Google popup, check if auth is null first
  if (auth) {
      signInWithPopup(auth, provider)
          .then((result) => {
          })
          .catch((error) => {
              console.log(error);
          }
      );

  }
}



    return (
      <>
        <Head>
            <title>Create New Job Log</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className='main'>
            {/* <h1>Create New Job Log</h1> */}
            {mode === "add" &&
            <h1>Create New Job Entry</h1>}
            {mode === "update" && 
            <h1>Update Job Entry</h1>}
            {mode === "gpt" &&
            <h1>Job Description from ChatGPT</h1>
            }

            {/* <h1>{mode === "add" ? "Create New Job Log" : "Update Job Log"}</h1> */}
           
            {user && (<button onClick={() => auth?.signOut()}>Sign out {user.email}</button>)}

            {!user && (
                // sign in button
                <button onClick={() => signIn()}>Sign in with Google</button>)}

{auth?.currentUser?.email !== "dustygalindo@gmail.com" && (
                <p>This is the form I use to submit new job applications. I use Google Auth to ensure that only submissions from my account will be accepted</p>)}
            


            {/* display success message if submissionSuccess is true */}
            {submissionSuccess && <p>Job Log Created!</p>}
            {/* display error message if submissionError is not empty */}
            {submissionError && <p>{submissionError}</p>}
            
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="companyName">Company Name</label>
                {/* display error message if companyNameError is not empty */}
                {companyNameError && <p className={styles.error}>{companyNameError}</p>}
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                
                <label htmlFor="jobTitle">Job Title</label>
                {/* display error message if jobTitleError is not empty with class 'error' */}
                {jobTitleError && <p className={styles.error}>{jobTitleError}</p>}
                <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
                
                {/* job url */}
                <label htmlFor="jobUrl">Job URL</label>
                {/* display error message if jobUrlError is not empty */}
                {jobUrlError && <p className={styles.error}>{jobUrlError}</p>}

                <input
                    type="text"
                    id="jobUrl"
                    name="jobUrl"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                />
                {/* job description */}
                <label htmlFor="jobDescription">Job Description</label>
                {/* display error message if jobDescriptionError is not empty */}
                {jobDescriptionError && <p className={styles.error}>{jobDescriptionError}</p>}
                <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <label htmlFor="dateApplied">Date Applied</label>
                <input
                    type="date"
                    id="dateApplied"
                    name="dateApplied"
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                />
                {/* display error message if dateAppliedError is not empty */}
                {dateAppliedError && <p className={styles.error}>{dateAppliedError}</p>}
                <label htmlFor="applicationStatus">Application Status</label>
                <select
                    id="applicationStatus"
                    name="applicationStatus"
                    value={applicationStatus}
                    onChange={(e) => setApplicationStatus(e.target.value)}
                >
                    <option value="">Select an Application Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                </select>
                {/* display error message if applicationStatusError is not empty */}
                {applicationStatusError && <p className={styles.error}>{applicationStatusError}</p>}
                <label htmlFor="salary">Salary</label>
                <textarea
                    id="salary"
                    name="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
                {/* display error message if salaryError is not empty */}
                {salaryError && <p>{salaryError}</p>}
                
                <button type="submit" disabled={isSubmitting}>
                Submit
                </button>
                {auth?.currentUser?.email !== "dustygalindo@gmail.com" && (<p className={styles.error}>You can click submit if you want to test the input validation (all fields required except &apos;salary&apos;). If the validation passes you&apos;ll be redirected to the Job Search Log page (the submission will be rejected by the database rules).</p>)}

            </form>

            <form>

            </form>
            
        </main>

        </>
    );
}
