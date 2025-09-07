import { signInWithPopup, GoogleAuthProvider, Auth, User } from "firebase/auth";
import { getAuthC } from 'src/utils/firebaseClient';
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Nav from "./nav";
import JobSearchLogEntry from "./jobSearchEntry";

const provider = new GoogleAuthProvider();
// create a custom hook to get the firebase auth instance
export function useAuth() : Auth | null{
    const [auth, setAuth] = useState<Auth | null>(null);
  
    useEffect(() => {
      // initialize firebase auth only once
      if (!auth) {
        setAuth(getAuthC());
      }
    }, [auth]);
  
    return auth;
  }
  interface Job {
    companyName: string;
    jobTitle: string;
    url: string;
    jobDescription: string;
    applicationStatus: string;
    salary: string;
  }

export default function GptJobEntry(){
    const auth = useAuth();
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

    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([{role:"assistant", content:"Paste the job description below"}]);
    const [newJob, setNewJob] = useState<Job | null>(null);


    async function onSubmit(e: any) {
        e.preventDefault();
        const userMessage = { role: "user", content: inputValue };
        let updatedMessages = [...messages, userMessage];
        try {
          const response = await fetch('/api/chatJobParser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: updatedMessages }),
          });
          const data = await response.json();
          console.log(data)
          const jobData = JSON.parse(data.content)

          if(jobData?.companyName){
            setNewJob(jobData)
          }
          setMessages([...updatedMessages, data])
        } catch (error) {
          console.error('Error:', error);
        }
        
      }
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
        <Head>New Job Entry (GPT version)</Head>
        <Nav />
        <main className="main">
        <h1>ChatGPT job description parser</h1>
  

        <div >
        {messages.map(
            (message, index: number) => (
            <div key={index}>
                <span>{message.role === 'assistant' ? 'Bot: ': 'You: '}</span>
                {message.role == 'user' && <span>job description...</span>}
                {message.role === 'assistant' && <span>{message.content}</span>}
            
            </div>
            )
        )}
        </div>
        {newJob && (
        <JobSearchLogEntry
          mode="gpt"
          jobData={newJob}
        />
      )}
            <form onSubmit={onSubmit}>
                <textarea
                placeholder="paste job description here"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                />
                <input type="submit" value="Submit"/>
            </form>
            
        </main>
        </>
      )
}