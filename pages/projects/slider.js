// components/Slider.js
import { useEffect, useRef } from "react";
// import link
import Link from "next/link";
//gamepad api
//https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
//import styles
import styles from '../../styles/Slider.module.css'


import Head from 'next/head'
import Nav from '../../components/nav'

export default function Slider() {
  // Create a ref to store the slider element
  const sliderRef = useRef(null);
  const audioRef = useRef(null);

  

  //initialize the playback speed to be 0.1. wait until the audio element is loaded before setting the playback speed.
  // set audioRef to the audio element
  useEffect(() => {
    const audio = document.querySelector("audio");
    audio.playbackRate = 1;
    audioRef.current = audio;
  }, []);
  
  
  // Skip ahead 30 seconds
  function skipAhead(audioRef) {
    const currentTime = audioRef.current.currentTime;
    // Add 30 seconds to the current time
    const newTime = currentTime + 30;
    // Set the current time of the audio element to the new time
    audioRef.current.currentTime = newTime;
  }
  // Skip back 30 seconds
  function skipBack(audioRef) {
    const currentTime = audioRef.current.currentTime;
    // Subtract 30 seconds from the current time
    const newTime = currentTime - 30;
    // Set the current time of the audio element to the new time
    audioRef.current.currentTime = newTime;
  }
  



  // debounce function to prevent multiple calls for each button press
  function debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }


  // update sliderRef based on the value of the slider input
  function handleSliderInput() {
    // Get the value of the slider
    const sliderValue = sliderRef.current.value;
    // Update the playback speed of the audio element
    audioRef.current.playbackRate = sliderValue;
    //if the playbackRate is less than or equal to 0.75, pause the audio element
    if (audioRef.current.playbackRate <= 0.75) {
      audioRef.current.pause();
    }
    //if the playbackRate is greater than 0.75, play the audio element
    if (audioRef.current.playbackRate > 0.75) {
      audioRef.current.play();
    }
  }

  // listen for the input event on the slider
  useEffect(() => {
    sliderRef.current.addEventListener("input", handleSliderInput);
  }, []);



  function handleRightTrigger(gamepad) {
    
    if (gamepad && gamepad.buttons[7]) {
      

      // Get the value of the right trigger, which ranges from 0 to 1
      const triggerValue = gamepad.buttons[7].value;
      // Map the trigger value to the slider range, which is from 0.75 to 3
      const sliderValue = triggerValue * (3 - 0.75) + 0.75;
      // Set the slider value
      sliderRef.current.value = sliderValue;
      // Update the playback speed of the audio element
      audioRef.current.playbackRate = sliderRef.current.value;
      //if the playbackRate is less than or equal to 0.75, pause the audio element
      if (audioRef.current.playbackRate <= 0.75) {
        audioRef.current.pause();
      }
      //if the playbackRate is greater than 0.6, play the audio element
      if (audioRef.current.playbackRate > 0.75) {
        audioRef.current.play();
      }
    }
  }

  


  // Define a function to handle gamepad input
  function handleGamepadInput() {
    
    // Get the first connected gamepad
    const gamepad = navigator.getGamepads()[0];
      // control the playback speed with the right trigger
      handleRightTrigger(gamepad);
      // skip ahead 30 seconds if the right bumper is pressed
      //todo: handleRightBumper(gamepad);
      // skip back 30 seconds if the left bumper is pressed
      //todo: handleLeftBumper(gamepad);
    // Request the next animation frame
    window.requestAnimationFrame(handleGamepadInput);
  }

  // Add an event listener for the gamepadconnected event on mount
  useEffect(() => {
    window.addEventListener("gamepadconnected", (e) => {
      console.log(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}`);
      // Start a loop to check for gamepad input every frame
      window.requestAnimationFrame(handleGamepadInput);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      console.log(`Gamepad disconnected from index ${e.gamepad.index}: ${e.gamepad.id}`);
    });
    
  }, []);

  return (
    <>
        <Head>
            <title>Gamepad Audio Control</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className="main">
    <h1>Gamepad 🎮 Audio Control</h1>
    
    <p>Use the right trigger on your connected gamepad to control the playback speed. It will pause if the trigger is released</p> 
    <p>You may need to interact with the document (click anywhere) before the browser will allow the audio to play. <a href='https://developer.chrome.com/blog/autoplay/'>More info.</a> </p>

    
    
    <div className={styles.audiobookCard}>
      <h2>Moby Dick</h2>
      <h3>Chapter 1</h3>
      <img src="https://th.bing.com/th/id/OIG.XPbmbHFKrR8FydeNjx2o"/>
      <h4>Herman Melville</h4>
      <h5>Narrator: Stewart Wills</h5>
    </div>
    <p>0.75x
    <input
      type="range"
      id="slider-control-0001"
    
      min="0.75"
      max="3"
      step="0.01"
      
      
      aria-valuetext="Normal speed"
      ref={sliderRef}
    />3x</p>
    
    {/* start the playback speed at 0.5 */}
    <audio src="https://www.archive.org/download/moby_dick_librivox/mobydick_001_002_melville.mp3" controls autoPlay={false} preload="auto" />

    <p>The cover art was generated in Bing Image Creator with the prompt: &quot;a white whale being controlled by a video game controller&quot;</p>
    <p>You can listen to the rest of the audiobook here: <Link href="https://librivox.org/moby-dick-by-herman-melville/">LibriVox</Link> </p>
    <p>This is just a quick demo. A few other features I&apos;d like to add are: skip ahead/back 30 seconds with the right/left bumper, volume control buttons, and a button to lock in the current playback speed.</p>
    </main>

    </>


  );

  
}


