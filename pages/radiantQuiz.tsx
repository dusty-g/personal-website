import Head from "next/head";
import { useState } from "react";
import Nav from "src/components/nav";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([{role:"assistant", content:
    
    `Welcome to the Knights Radiant quiz! Let’s discover which Order best aligns with your personality, values, and inner strengths. Answer honestly, and we’ll unveil your true place among the Radiants.

Question 1:
When faced with a conflict, what is your first instinct?
a) Step in to protect those who might be harmed.
b) Assess what is fair and enforce justice, even if it’s unpopular.
c) Look within and control your emotions before taking action.
d) Seek to understand everyone’s perspectives and offer compassion.
e) Analyze the situation to uncover the deeper truth.
f) Use creativity to express your feelings or help others see things differently.
g) Plan how to improve the situation logically and efficiently.
h) Take a bold step forward, exploring new possibilities to solve the problem.
i) Support others through your dependability and resilience.
j) Work to unify everyone and find common ground.

Take your time! Which option resonates most with you?`}]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  async function onSubmit(e: any) {
    e.preventDefault();
    // Check if inputValue is empty or consists only of whitespace
    if (!inputValue.trim()) {
      return;
    }
    setIsLoading(true);
    const userMessage = { role: "user", content: inputValue };
    let updatedMessages = [...messages, userMessage];
    try {
      const response = await fetch('/api/chatBot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();
      setMessages([...updatedMessages, data]);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
    setInputValue("");
  }

  return (
    <>
      <Head>
        <title>Chat Bot</title>
        <meta name="description" content="Personal website for Dusty Galindo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="main">
        <h1>Which Order of the Knights Radiant are you?</h1>
        <hr/>
        <div className={styles.conversation}>
        {messages.map(
            (message, index: number) => (
            <div 
                key={index}
                className={`${styles.message} ${message.role === 'user' ? styles.user_message : styles.assistant_message}`}
            >
                <span className={styles.message_role}>{message.role === 'assistant' ? 'Bot: ': 'You: '}</span>
                <span className={styles.message_content}>{message.content}</span>
            </div>
            )
        )}
        </div>
        <form onSubmit={onSubmit}>
          {isLoading && <div className={styles.spinner}></div>}
            <input
            type="text"
            placeholder="Hello!"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.textInput}
            />
            <input 
            type="submit" 
            value={isLoading ? "Generating..." : "Submit"}
            className={styles.submitButton}
            disabled={isLoading} 
            />
            
  </form>
  </main>
    </>
  );
}
