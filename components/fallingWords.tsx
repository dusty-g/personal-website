import { useEffect, useState } from 'react';
import styles from '../styles/FallingWords.module.css';
const words: string[] = ['Fizz', 'Buzz', 'FizzBuzz'];


const FallingWords = () => {
    const [fallingWords, setFallingWords] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState<number>(1);

    const addFallingWord = () => {
        // Set falling word based on wordCount. If wordCount is divisible by 3, 5, or 15,
        // set falling word to Fizz, Buzz, or FizzBuzz respectively. Otherwise, set falling word to the wordCount.
        let newWord = wordCount.toString();
        if (wordCount > 100) {
            // Reset wordCount and fallingWords if wordCount is greater than 100
            setWordCount(1);
            setFallingWords([]);
        }
        if (wordCount % 15 === 0) {
          newWord = words[2];
        } else if (wordCount % 5 === 0) {
          newWord = words[1];
        } else if (wordCount % 3 === 0) {
          newWord = words[0];
        }
        setFallingWords(prevFallingWords => [...prevFallingWords, newWord]);
      };
    
      const incrementWordCount = () => {
        setWordCount(prevWordCount => prevWordCount + 1);
      };

      // Add a new falling word every 500 ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      addFallingWord();
      incrementWordCount();
    }, 500);
    return () => clearInterval(intervalId);
  }, [wordCount]);


  return (
    <div className={styles.container}>
      {fallingWords.map((word: string, index: number) => (
        <span key={index} className={styles.fallingWord}>
          {word}
        </span>
      ))}
    </div>
  );
};

export default FallingWords;