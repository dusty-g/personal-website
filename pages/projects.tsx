import Nav from "src/components/nav";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import typImage from "../public/KR_TYP.png";
import shoveler from "../public/shoveler.png"
import styles from "../styles/Projects.module.css";
//placeholder for projects page
export default function Projects() {
    return (
        <>
        <Head>
            <title>Projects</title>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5213545915383529"
     crossOrigin="anonymous"></script>
            <meta name="description" content="Personal website for Dusty Galindo" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav />
        <main className="main">
            <h1>Projects</h1>
            {/* list of projects */}
            <ul className={styles.projectsList}>
            <li><h3>Small/Fun projects</h3>
                    <ul>
                        <li><Link href="projects/cellularAutomata/">Cellular Automata</Link></li>
                        <li><Link href="projects/fizzbuzz">fizzbuzz</Link></li>
                        {/* link to pokemon.html in public directory */}
                        <li><Link href="/pokemon.html">Experimenting with P5.js</Link></li>
                    </ul>
                </li>
                <li><h3>Kindle Rewards (Amazon)</h3>
                    <ul>
                        
                        <li><h4>&quot;Thank You Page&quot; message</h4>
                        <Image className={styles.projectImage} src={typImage} alt="Kindle Rewards Thank You page" />
                            <ul>
                                <li>Added a message to the Amazon &quot;Thank You&quot; page on eligible ebook purchases to increase awareness of the Kindle Rewards program and drive traffic to the Kindle Rewards homepage.</li>
                                <li>Front end: HTML, CSS, JavaScript</li>
                                <li>Back end: Java</li>
                                <li>Required calling multiple backend services to check customer and ebook eligibility. Due to the interdependent nature of these changes, I took on the responsibility of coordinating with each of the respective teams and obtaining their approval in order to ensure the successful launch of this new feature.</li>
                                </ul>
                        </li>
                        <li><h4>Rewards Home Books Carousel</h4></li>
                        <Image className={styles.projectImage} src={shoveler} alt="Kindle Rewards home page"/>
                            <ul>
                                <li>I was responsible for configuring the backend systems used to generate personalized book recommendations to customers on the Kindle Rewards home page. This involved collaborating with the teams who owned the recommendation systems, as well as the team who owned the system that delivered the generated recommendations to the book carousel on the front end. 
                                </li>
                                <li>I also had to coordinate with the team who owned the home page that displayed the book carousel, ensuring that it was compatible with the backend systems and met the design and performance requirements.</li>
                            </ul>
                        </ul>
                </li>
                <li>This website! 
                    <ul>
                        <li>Built using Next.js</li>
                        <li>Deployed to Google App Engine</li>
                        <li><Link href="https://github.com/dusty-g/personal-website"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" ><g transform="scale(0.15)"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></g></svg>GitHub Repo</Link></li>
                    </ul></li>
                
            </ul>
        
        </main>
        </>
    );
    }
