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
            <h2>Summary</h2>
            <hr className={styles.boldLine} />
            <p>Software developer with 2 years of experience in developing and deploying features and enhancements for various projects at Amazon using Java, AWS and JavaScript. Skilled in web programming, data structures, algorithms and object-oriented design. Completed Amazon Technical Academy, a full-time 9-month instructor led software development training program. Looking for new opportunities to apply my skills and experience in software development.</p>

            
            <h3>Skills</h3>

            <p>Java | AWS | JavaScript | React | Data Structures | Algorithms | Object-Oriented Design | Web Development</p>
            <hr className={styles.boldLine} />
            <section>
            <h2>Work Experience</h2>
            <hr className={styles.boldLine}/>
            <div className={styles.employerContainer}>
            <img src="https://media.licdn.com/dms/image/C560BAQHTvZwCx4p2Qg/company-logo_100_100/0/1612205615891?e=1683158400&v=beta&t=_7JS-HkS5H7O8IbLfuUCciqO_blsO0xjR_ATBKAK8Zs"></img><div><h3>Amazon.com</h3><p>Jul 2019 - Mar 2023</p></div></div>
            
            <h4>Software Development Engineer</h4>
            <p className={styles.dates}>Jan 2021 - March 2023</p>
            <ul> <li><p>Designed, developed and deployed features and enhancements for the Kindle Rewards program using Java, Kotlin, AWS and JavaScript</p></li> <li><p>Created a widget that displays Kindle Rewards balance to increase customer engagement</p></li> <li><p>Improved customer satisfaction and loyalty by adding personalized book recommendations based on customer preferences and behavior to Kindle Rewards home page</p></li> <li><p>Boosted Kindle Rewards engagement rates by building a dynamic awareness message at checkout that notifies eligible customers they have earned points, and links to the Rewards home page</p></li> <li><p>Ensured high availability and reliability of Kindle Rewards services by participating in an on-call rotation and resolving issues in a timely manner</p></li> <li><p>Optimized delivery experience and reduced costs by contributing to a framework that selects the best ship option for each order based on various factors such as location, inventory and demand</p></li> <li><p>Streamlined code review process and reduced operational load from partner teams by creating an automated tool that checks code quality and compliance using Java and AWS Lambda</p></li> <li><p>Completed Amazon Technical Academy, a full-time 9-month instructor led software development training program that covers topics such as data structures, algorithms, object-oriented design, web development, databases, cloud computing and more</p></li> </ul>
            <hr/>
            <h4>Prime Air Flight Operations</h4>
            <p className={styles.dates}>Jul 2019 - Jan 2021</p>
            <ul>
              <li><p>Performed pre-flight checks and inspections of drone systems and components</p></li>
              <li><p>Monitored and recorded flight data and telemetry using software tools and sensors</p></li>
              <li><p>Troubleshot and resolved technical issues and malfunctions during test flights</p></li>
              <li><p>Provided feedback and recommendations to engineers and developers on drone performance and functionality</p></li>
              <li><p>Followed safety protocols and regulations to ensure compliance and minimize risks</p></li>
            </ul>
            <hr className={styles.boldLine}/>
            <div className={styles.employerContainer}><img src="https://media.licdn.com/dms/image/C560BAQGYO9Q1rEKrpg/company-logo_100_100/0/1600949156478?e=1683158400&v=beta&t=ptNySF2o32Inh3t2JGZmVwS3DBhvEH-Eam85meVx8Hs"/><div><h3>Jabil</h3><p>Apr 2018 - Jul 2019</p></div></div>
            <h4>Additive Manufacturing Technician</h4>
            <ul>
              <li><p>Configured and optimized build parameters and settings for various polymer materials and geometries</p></li>
              <li><p>Performed post-processing operations such as de-powdering, cleaning, and inspection of printed parts</p></li>
              <li><p>Conducted quality control tests and measurements using tools such as calipers, micrometers and scanners</p></li>
              <li><p>Documented and reported build results, issues and improvement opportunities to engineers and managers</p></li>
              <li><p>Adhered to safety standards and best practices for handling hazardous materials and equipment</p></li>
            </ul>
            </section>
        </div>
      </main>
    </>
  )
}
