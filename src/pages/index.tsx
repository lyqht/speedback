import Login from '@/components/Login';
import GeneralLayout from '@/layouts/GeneralLayout';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from 'flowbite-react';
import Head from 'next/head';
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
      </Head>

      <GeneralLayout>
        <div className="grid place-items-center p-4">
          {currentUser ? (
            <div className="w-3/4 h-full items-center flex-row flex justify-evenly align-top">
              <div className="h-1/4 m-4 items-center flex flex-col p-4 justify-start">
                <h1 className="text-2xl font-dynapuff pb-4">
                  Are you a captain?
                </h1>
                <Button size={`xl`} href="/ship/create">
                  Create a Ship
                </Button>
                <Link href="/ship/join">
                  <p className="text-sm italic hover:text-blue-400 hover:cursor-pointer">
                    Join back a Ship
                  </p>
                </Link>
              </div>
              <div className="h-1/4 m-4 items-center flex flex-col p-4 justify-start">
                <h1 className="text-2xl font-dynapuff pb-4">Are you a crew?</h1>
                <Button size={`xl`} href="/ship/join">
                  Join a Ship
                </Button>
              </div>
            </div>
          ) : (
            <Login />
          )}
        </div>
      </GeneralLayout>
    </div>
  );
}
