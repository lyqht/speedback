import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

type LoginMode = 'signUp' | 'signIn';

const Login = () => {
  const [loginMode, setLoginMode] = useState<LoginMode>(`signUp`);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [errorText, setErrorText] = useState(``);

  return (
    <div className="w-full m-4 flex items-center flex-col md:flex-row mt-4 gap-4 h-full">
      <div className="md:w-1/2 md:p-12 flex flex-col h-full text-lg">
        <p>
          Speedback is an intentional, timeboxed session to exchange feedback
          among a team.
        </p>
        <p>
          <span className="font-dynapuff">Ahoy!</span> helps you to easily
          generate Zoom-like breakout rooms with a round robin schedule
          optimized for speedback.
        </p>
      </div>
      <div
        id="login-content"
        className="p-8 md:p-12 w-full md:w-1/2 bg-blue-200 rounded shadow"
      >
        <p className="text-lg font-dynapuff italic">
          Ready to join the cruise?
        </p>
        <div className="flex-row flex items-center my-4">
          {loginMode === `signIn` ? (
            <>
              <p className="-ml-2 p-2 bg-blue-600 text-white rounded">
                Sign In
              </p>
              <button
                className="p-2 opacity-60 rounded hover:bg-blue-400 hover:text-white hover:opacity-100"
                onClick={() => {
                  setLoginMode(`signUp`);
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              <button
                className="p-2 -ml-2 opacity-60 rounded hover:bg-blue-400 hover:text-white hover:opacity-100"
                onClick={() => {
                  setLoginMode(`signIn`);
                }}
              >
                Sign in
              </button>
              <p className="p-2 bg-blue-600 text-white rounded">
                Create for an account
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="johnsmith@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <div className="block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            id="password"
            type="password"
            required={true}
            value={password}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorText ? <p>{errorText}</p> : null}
        <div className="my-8">
          <Button
            onClick={async () => {
              let response;
              if (loginMode === `signUp`) {
                response = await supabaseClient.auth.signUp({
                  email,
                  password,
                });
              } else {
                response = await supabaseClient.auth.signIn({
                  email,
                  password,
                });
              }

              if (response.error) {
                console.error(response.error);
                setErrorText(response.error.message);
              }
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
