import Head from "next/head";
import { useState } from "react";
import Nav from "src/components/nav";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([{role:"assistant", content:"Hello! I'm a chatbot that can answer any questions you have about Dusty Galindo and his work history. Is there anything specific you'd like to know about Dusty or his experience?"}]);
  const [inputValue, setInputValue] = useState("");

  async function onSubmit(e: any) {
    e.preventDefault();
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
        <h3>Résumé Bot</h3>
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
            <input
            type="text"
            placeholder="Hello!"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.textInput}
            />
            <input 
            type="submit" 
            value="Submit" 
            className={styles.submitButton} 
            />
  </form>
  </main>
    </>
  );
}