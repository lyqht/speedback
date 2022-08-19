import Login from '@/components/Login';
import { getUser } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { Button } from 'flowbite-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';

export default function Home({ user }: { user: UserResponse }) {
  const [currentUser, setCurrentUser] = useState(user);

  return (
    <div className="h-screen">
      <Head>
        <title>Ahoy! Speedback ⚡️</title>
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
      <main className="p-4">
        <h1 className="text-2xl">Pirates assemble!</h1>
        {currentUser ? (
          <div className="justify-between flex flex-col w-1/2">
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
        ) : (
          <Login setCurrentUser={setCurrentUser} />
        )}
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUser(context);

  return {
    props: { user },
  };
};
