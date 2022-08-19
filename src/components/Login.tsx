import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';

const Login = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  return (
    <div>
      <i className="text-lg">Ready to join the cruise?</i>
      <div className="py-4">
        <h1>Create an account</h1>
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
          onClick={async () => {
            const response = await supabaseClient.auth.signUp({
              email,
              password,
            });

            console.log({ response });
            if (response.error) {
              console.error(response.error);
              setErrorText(response.error.message);
            }

            setCurrentUser(response.data);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Login;
