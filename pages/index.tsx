import Head from 'next/head'
import Nav from 'src/components/nav'



//home page for my personal website
export default function Home() {
  return (
    <>
      
      <Head>
        <title>Dusty Galindo</title>
        <meta name="description" content="Generated by create next app" />
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
