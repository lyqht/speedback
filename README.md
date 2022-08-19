# Speedback

## Features

- Join and create your own ships — Ahoy mate!
- In your ship, you can see who has joined your room
- Before starting the session, the crew members can set ready/ not ready status.

## Building Blocks

- Next.js
- Supabase Realtime DB
- Supabase Auth Helpers
- Daily

## Features not implemented yet

- Error handling for join ship/ create ship if API call to Supabase fails
- If a user closes the tab/browser accidentally, there should be a prompt to ask user if they want to be redirected to the previous room that they are in
  - If the session has not started, join waiting room
  - If the session has started, captain/crew should rejoin the call they were in.
- Late crew to be able to join sesions that have already started.
- Additional Captain functionalities
  -  Kick participants
  -  Rename room
  -  Set co-host of ship
  -  Modify pairing schedule
