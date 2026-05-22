import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";

function App() {
  const { isSignedIn } = useUser();

  return (
    <div>
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal" />
          <SignUpButton />
        </>
      ) : (
        <UserButton />
      )}
    </div>
  );
}

export default App;
