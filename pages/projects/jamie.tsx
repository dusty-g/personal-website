"use client";
import Nav from 'src/components/nav'
import Head from 'next/head'



import "chart.js/auto";

import { Line } from "react-chartjs-2";



// This function runs at request time on the server.
export async function getServerSideProps() {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/Sheet1!A:B?key=${process.env.API_KEY}`
    );
    const data = await response.json();
    // extract values and remove header row
    const rows = data.values.slice(1);
    // create arrays for your dates and weights
    const dates = rows.map((row: string[]) => row[0]);
    const weights = rows.map((row: string[]) => parseFloat(row[1])); // convert weights from strings to numbers
    // process rows into the format your charting library needs
    const chartData = {
        labels: dates,
        datasets: [
          {
            label: "Jamie's Weight (lbs)",
            data: weights,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      };
      
  
    return {
      props: {
        chartData,  // this will be passed to the page component as props
      },
    };
  }

  

  export default function Jamie(props: { chartData: any }) {
    
    
    return (
        <>
        <Head>
            <title>Jamie</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        
        <main className='main'>
        <h1>Jamie</h1>
        {/* component with weight graph here */}
        <div>
          <Line data={props.chartData}/>
        </div>
    
        </main>
        </>
    )
    }