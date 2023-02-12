import Head from 'next/head'
import Nav from 'src/components/nav'



//home page for my personal website
export default function Home() {
  return (
    <>
      
      <Head>
      {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5213545915383529"
     crossOrigin="anonymous"></script> */}
        <title>Dusty Galindo</title>
        <meta name="description" content="personal website of Dusty Galindo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Nav />
      <main className="main">
        <h1>
          Dusty Galindo
        </h1>
    
        
        <p>
          Hello! My name is Dusty Galindo. I am a software developer in Seattle, Washington.
        </p>

      </main>
    </>
  )
}
