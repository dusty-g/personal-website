import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, User } from "firebase/auth";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Nav from "./nav";

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
        <h1>gpt job description parser</h1>
        {user && (<button onClick={() => auth?.signOut()}>Sign out {user.email}</button>)}

            {!user && (
                // sign in button
                <button onClick={() => signIn()}>Sign in with Google</button>)}

        <div >
        {messages.map(
            (message, index: number) => (
            <div 
                key={index}
                
            >
                <span>{message.role === 'assistant' ? 'Bot: ': 'You: '}</span>
                {message.role == 'user' && <span>job description...</span>}
                {message.role === 'assistant' && <span>{message.content}</span>}
            
            </div>
            )
        )}
        </div>
            
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