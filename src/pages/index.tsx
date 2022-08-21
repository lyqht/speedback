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
            <div className="flex h-full w-3/4 flex-row items-center justify-evenly align-top">
              <div className="m-4 flex h-1/4 flex-col items-center justify-start p-4">
                <h1 className="pb-4 font-dynapuff text-2xl">
                  Are you a captain?
                </h1>
                <Button size={`xl`} href="/ship/create">
                  Create a Ship
                </Button>
                <Link href="/ship/join">
                  <p className="text-sm italic hover:cursor-pointer hover:text-blue-400">
                    Join back a Ship
                  </p>
                </Link>
              </div>
              <div className="m-4 flex h-1/4 flex-col items-center justify-start p-4">
                <h1 className="pb-4 font-dynapuff text-2xl">Are you a crew?</h1>
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
