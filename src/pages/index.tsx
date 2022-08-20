import Login from '@/components/Login';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from 'flowbite-react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const currentUser = useUser().user;
  return (
    <div className="h-full">
      <Head>
        <title>Ahoy! Speedback ⚡️</title>
        <meta
          name="description"
          content="The easiest way to conduct Speedback for your team."
        />
        <meta
          name="keywords"
          content="team, feedback, speedback, collaboration, retro, agile"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="p-4 h-full">
        <div className="grid place-items-center w-full">
          <h1 className="text-3xl text-center font-dynapuff">Ahoy!</h1>
        </div>
        {currentUser ? (
          <div className="w-1/2 h-full">
            <p className="text-2xl text-center">Pirates assemble!</p>
            <div className="h-1/4 m-4 items-center flex flex-col p-4">
              <h1 className="text-2xl">Are you a captain?</h1>
              <Button href="/ship/create">Create a Ship</Button>
              <Link href="/ship/join">Join back a Ship</Link>
            </div>
            <div className="h-1/4 m-4 items-center flex flex-col p-4">
              <h1 className="text-2xl">Are you a crew?</h1>
              <Button href="/ship/join">Join a Ship</Button>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}
