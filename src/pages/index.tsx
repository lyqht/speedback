import Login from '@/components/Login';
import { getUser, User } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { Button } from 'flowbite-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export default function Home({ user }: { user: User }) {
  let currentUser: User | null = user;
  if (!user) {
    currentUser = useUser().user;
  }

  return (
    <div className="h-full">
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
      <main className="p-4 h-full">
        <div className="grid place-items-center w-full">
          <h1 className="text-2xl text-center">Pirates assemble!</h1>
        </div>
        {currentUser ? (
          <div className="w-1/2 h-full">
            <div className="h-1/4 m-4 items-center flex flex-col p-4">
              <h1 className="text-2xl">Are you a captain?</h1>
              <Button href="/ship/create">Create a Ship</Button>
              <a href="/ship/join">Join back a Ship</a>
            </div>
            <div className="h-1/4 m-4 items-center flex flex-col p-4">
              <h1 className="text-2xl">Are you a crew?</h1>
              <Button href="/ship/join">Join a Ship</Button>
              <a href="/room">Join back a call</a>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await getUser(context);

  return {
    props: { user },
  };
};
