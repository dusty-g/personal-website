import { useEffect, useState } from "react";
// import firebase
import { push, ref, set } from "firebase/database";
import { db } from 'src/pages/_app'
import Head from "next/head";
import Nav from "src/components/nav";

import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, User } from "firebase/auth";

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




// create a new job search log entry
export default function New() {
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
    // user
    


    
    
        
    
     
    
            





    // set state for form data
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [dateApplied, setDateApplied] = useState('');
    const [applicationStatus, setApplicationStatus] = useState('');
    const [notes, setNotes] = useState('');
    // set state for form validation
    const [companyNameError, setCompanyNameError] = useState('');
    const [jobTitleError, setJobTitleError] = useState('');
    const [jobDescriptionError, setJobDescriptionError] = useState('');
    const [dateAppliedError, setDateAppliedError] = useState('');
    const [applicationStatusError, setApplicationStatusError] = useState('');
    const [notesError, setNotesError] = useState('');
    // set state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    // set state for form submission success
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // handle form submission
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // validate form
        setCompanyNameError('');
        setJobTitleError('');
        setJobDescriptionError('');
        setDateAppliedError('');
        setApplicationStatusError('');
        setNotesError('');
        // set error state if form is invalid
        if (companyName === '') {
            setCompanyNameError('Company Name is required');
        }
        if (jobTitle === '') {
            setJobTitleError('Job Title is required');
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

        // if form is valid, submit form
        if (companyName && jobTitle && dateApplied && applicationStatus && notes) {
            // set isSubmitting to true to disable form
            setIsSubmitting(true);
            // set submissionError to empty string
            setSubmissionError('');
            // submit form
            const newJob = {
                companyName: companyName,
                jobTitle: jobTitle,
                jobDescription: jobDescription,
                dateApplied: dateApplied,
                applicationStatus: applicationStatus,
                notes: notes
            };
            // push new job to firebase
            push(ref(db, 'jobs'), newJob)
                .then(() => {
                    // set isSubmitting to false to enable form
                    setIsSubmitting(false);
                    // set submissionSuccess to true to display success message
                    setSubmissionSuccess(true);
                })
                .catch((error) => {
                    // set isSubmitting to false to enable form
                    setIsSubmitting(false);
                    // set submissionError to error message
                    setSubmissionError(error.message);
                }
            );
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
            <h1>Create New Job Log</h1>
           
            {user && (<button onClick={() => auth?.signOut()}>Sign out {user.email}</button>)}

            {!user && (
                // sign in button
                <button onClick={() => signIn()}>Sign in with Google</button>)}

            {auth?.currentUser?.email !== "dustygalindo@gmail.com" && (
                <p>You are not authorized to view this page. This is where I submit new jobs I applied for.</p>)}


            {/* display success message if submissionSuccess is true */}
            {submissionSuccess && <p>Job Log Created!</p>}
            {/* display error message if submissionError is not empty */}
            {submissionError && <p>{submissionError}</p>}
            
            {auth?.currentUser?.email === "dustygalindo@gmail.com" && (
            <form onSubmit={handleSubmit}>
                <label htmlFor="companyName">Company Name</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                {/* display error message if companyNameError is not empty */}
                {companyNameError && <p>{companyNameError}</p>}
                <label htmlFor="jobTitle">Job Title</label>
                <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
                <label htmlFor="jobDescription">Job Description</label>
                {/* display error message if jobDescriptionError is not empty */}
                {jobDescriptionError && <p>{jobDescriptionError}</p>}
                <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                {/* display error message if jobTitleError is not empty */}
                {jobTitleError && <p>{jobTitleError}</p>}
                <label htmlFor="dateApplied">Date Applied</label>
                <input
                    type="date"
                    id="dateApplied"
                    name="dateApplied"
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                />
                {/* display error message if dateAppliedError is not empty */}
                {dateAppliedError && <p>{dateAppliedError}</p>}
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
                {applicationStatusError && <p>{applicationStatusError}</p>}
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                {/* display error message if notesError is not empty */}
                {notesError && <p>{notesError}</p>}
                <button type="submit" disabled={isSubmitting}>
                    Submit
                </button>
            </form>
            )}
        </main>

        </>
        );
}