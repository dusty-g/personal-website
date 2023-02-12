import Nav from 'src/components/nav'
import Head from 'next/head'


export default function FizzBuzz() {
    
    return (
        <>
        <Head>
            <title>FizzBuzz</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <h1>FizzBuzz</h1>
        <p>Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.</p>
        {/* add "rain in the background" */}
        <div className="rain"></div>
    
        </>
    )
    }