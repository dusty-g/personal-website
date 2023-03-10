import Head from "next/head";
import Image from "next/image";
import Nav from "src/components/nav";
import styles from "../styles/About.module.css";
import profilePic from "../public/dusty2.jpg";

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
         <link href="https://fonts.cdnfonts.com/css/amazon-ember" rel="stylesheet"></link>
        <div className={styles.resume}>
            <section>
            <h2>Work Experience</h2>
            <hr className={styles.boldLine}/>
            <div className={styles.employerContainer}>
            <img src="https://media.licdn.com/dms/image/C560BAQHTvZwCx4p2Qg/company-logo_100_100/0/1612205615891?e=1683158400&v=beta&t=_7JS-HkS5H7O8IbLfuUCciqO_blsO0xjR_ATBKAK8Zs"></img><div><h3>Amazon.com</h3><p>Jul 2019 - Jan 2023</p></div></div>
            
            <h4>Software Development Engineer</h4>
            <p className={styles.dates}>Dec 2021 - Jan 2023</p>
            <p>Contributed to the successful launch of Kindle Rewards Beta, a new program that rewards customers for purchasing books.</p>
            <p>Worked on backend Kindle points logic, book recommendation widget on the Kindle Rewards home page, and a points balance widget on Kindle mobile apps (iOS, Android, and FireOS).</p>
            <p>Also contributed to delivery ship option selection framework supporting internal teams building new delivery programs.</p>
            <p>Part of a 24/7 on-call rotation.</p>
            <hr className={styles.normalLine}/>
            <h4>Amazon Technical Academy - Software Development Trainee</h4>
            <p className={styles.dates}>Jan 2020 - Dec 2021</p>
            <p>Completed a full-time 12-month instructor-led software development training program. Included a 3-month internship.</p>
            <hr className={styles.normalLine}/>
            <h4>Flight Operations Assistant</h4>
            <p className={styles.dates}>Jul 2019 - Jan 2020</p>
            <p>Assisted with the setup and operation of experimental aircraft (large delivery drones)</p>
            <hr></hr>
            <div className={styles.employerContainer}><img src="https://media.licdn.com/dms/image/C560BAQGYO9Q1rEKrpg/company-logo_100_100/0/1600949156478?e=1683158400&v=beta&t=ptNySF2o32Inh3t2JGZmVwS3DBhvEH-Eam85meVx8Hs"/><div><h3>Jabil</h3><p>Apr 2018 - Jul 2019</p></div></div>
            <h4>Additive Manufacturing Technician</h4>
            <p>Operated and maintained a variety of polymer powder bed fusion machines and related shop equipment.</p>
            <p>Assisted engineers with development and qualification of new polymers for aerospace applications.</p>
            </section>
        </div>
      </main>
    </>
  )
}
