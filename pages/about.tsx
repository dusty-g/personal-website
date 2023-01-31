import Head from "next/head";
import Image from "next/image";
import Nav from "src/components/nav";
import styles from "../styles/About.module.css";

//placeholder for about page
export default function About() {
  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="Personal website for Dusty Galindo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="main">
        <h1>
          About
        </h1>
        <Image className={styles.profilePic} src="/dusty1.jpg" alt="Photo of Dusty Galindo" width={500} height={500} quality={75} />
        <p>🚧Note: this page is a work in progress🚧</p>


      </main>
    </>
  )
}
