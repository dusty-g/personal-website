//import styles
import styles from '../styles/Home.module.css';
//import confetti
// @ts-ignore
import ConfettiGenerator from 'confetti-js';
import Link from 'next/link';

export default function Confetti() {
    //handle click
    const handleClick = () => {
       
    
        //create a new confetti generator
        const confettiSettings = { target: 'canvas' };
        const confetti = new ConfettiGenerator(confettiSettings);
        //start the confetti
        confetti.render();
        //stop the confetti after 3 seconds
        setTimeout(() => {
            confetti.clear();

        }, 3000);
        
        //after the confetti is done, remove the canvas and replace the button with a new button
        
        

    }
    return (
        <>
        <nav>
        <ul className={styles.nav}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/confetti">Confetti</Link></li>
          <li className={styles.inactive}><Link href="/about">About</Link></li>
          <li className={styles.inactive}><Link href="/projects">Projects</Link></li>
          <li className={styles.inactive}><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>
        <button className={styles.button} onClick={handleClick}>Click Here</button>
        <div>
        
        
        <canvas id="canvas"></canvas>
        
        </div>

        </>
       
        
    );
    }