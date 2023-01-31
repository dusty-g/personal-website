import Nav from "src/components/nav";
import Head from "next/head";
import styles from "../styles/Contact.module.css";
import Link from "next/link";

//contact page
export default function Contact() {
    return (
        <>
        <Head>
            <title>Contact</title>
            <meta name="description" content="Personal website for Dusty Galindo" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className="main">
            <h1>Contact</h1>
            <p>🚧Note: this page is a work in progress🚧</p>
            <p>
             todo: add contact form
            </p>
           <p>You can email me at firstname.lastname at gmail dot com</p>
            
            <p>Or send a message on LinkedIn:  <a className={styles.linkedinContainer} href="https://www.linkedin.com/in/dusty-galindo-064a8110a"> <svg className={styles.linkedinBadge} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" width="24" height="24" focusable="false">
  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
</svg><b className={styles.b}>Dusty Galindo</b></a> </p>
      
            
              
        </main>
        </>
    )
}