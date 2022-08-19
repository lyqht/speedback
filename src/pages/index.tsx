import { Button } from 'flowbite-react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="h-screen">
      <Head>
        <title>Speedback Ahoy!</title>
        <meta
          name="description"
          content="Easiest way to conduct Speedback for your team."
        />
        <meta
          name="keywords"
          content="team, feedback, speedback, collaboration, retro, agile"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Pirates assemble!</h1>
        <div className="justify-between flex flex-col p-4 w-1/2">
          <div className="items-center flex flex-col p-4">
            <h1 className="text-2xl">Are you a captain?</h1>
            <Button href="/ship/create">Create a Ship</Button>
            <a href="/ship/join">Join back a Ship</a>
          </div>
          <div className="items-center flex flex-col p-4">
            <h1 className="text-2xl">Are you a crew?</h1>
            <Button href="/ship/join">Join a Ship</Button>
            <a href="/room">Join back a call</a>
          </div>
        </div>
      </main>
    </div>
  );
}
