import Login from '@/components/Login';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from 'flowbite-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const currentUser = useUser().user;
  return (
    <div className="h-full">
      <Head>
        <title>Speedback Ahoy!</title>
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
      <main className="h-full justify-between flex flex-col">
        <div id="main-content" className="p-8">
          <div className="grid place-items-center w-full">
            <h1 className="text-6xl text-center font-dynapuff">Ahoy!</h1>
            <p className="text-2xl text-center">Pirates assemble 🏴‍☠️</p>
          </div>
          <div className="grid place-items-center p-4">
            {currentUser ? (
              <div className="w-3/4 h-full items-center flex-row flex justify-evenly align-top">
                <div className="h-1/4 m-4 items-center flex flex-col p-4 justify-start">
                  <h1 className="text-2xl font-dynapuff pb-4">
                    Are you a captain?
                  </h1>
                  <Button size={'xl'} href="/ship/create">
                    Create a Ship
                  </Button>
                  <Link href="/ship/join">
                    <p className="text-sm italic hover:text-blue-400 hover:cursor-pointer">
                      Join back a Ship
                    </p>
                  </Link>
                </div>
                <div className="h-1/4 m-4 items-center flex flex-col p-4 justify-start">
                  <h1 className="text-2xl font-dynapuff pb-4">
                    Are you a crew?
                  </h1>
                  <Button size={'xl'} href="/ship/join">
                    Join a Ship
                  </Button>
                </div>
              </div>
            ) : (
              <Login />
            )}
          </div>
        </div>
        <div className="w-full relative">
          <img
            id="bottom-background"
            alt="Background waves"
            className="w-full bg-cover opacity-60 -z-20"
            src={'/bottom_waves.svg'}
          />
          <p className="font-dynapuff absolute bottom-0 right-0 text-white text-lg p-4">
            Made by{' '}
            <a
              className="underline decoration-white decoration-4 underline-offset-4"
              href={'https://github.com/lyqht/'}
            >
              @lyqht
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
