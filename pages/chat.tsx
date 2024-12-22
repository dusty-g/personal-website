import Head from "next/head";
import { useState } from "react";
import Nav from "src/components/nav";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([{role:"assistant", content:"Hello! I'm a chatbot that can answer questions you have about Dusty Galindo and his work history. Is there anything specific you'd like to know about Dusty or his experience?"}]);
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
        <h1>Résumé Bot</h1>
        <p className={styles.description}>This is using OpenAI's chat completion API with GPT-4o mini as the model. My resume and some instructions are provided as the "System message" and your input is sent as the "User message". Each response is capped at 500 tokens (rougly 1,000 characters) to keep costs down. The price for gpt-4o-mini is only $0.000600 / 1K output tokens! I've also set a monthly spending limit of $5/month just in case.</p>
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
