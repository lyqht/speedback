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
    <div>
      <i className="text-lg">Ready to join the cruise?</i>
      <div className="py-4">
        <div className="flex-row flex items-center">
          {loginMode === `signIn` ? (
            <>
              <p className="pr-4 py-4 underline decoration-black">Sign In</p>
              <button
                className="hover:underline decoration-black"
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
                className="hover:underline decoration-black"
                onClick={() => {
                  setLoginMode(`signIn`);
                }}
              >
                Sign in
              </button>
              <p className="p-4 underline decoration-black">
                Create for an account
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="johnsmith@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
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
      </div>
      <div className="py-4">
        <Button
          color={`success`}
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
  );
};

export default Login;
