// import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
// function App() {
//   const { isSignedIn } = useUser();

//   return (
//     <div>
//       {!isSignedIn ? (
//         <>
//           <SignInButton mode="modal" />
//           <SignUpButton />
//         </>
//       ) : (
//         <UserButton />
//       )}
//     </div>
//   );
// }
// export default App;

// import { SignInButton, SignUpButton, UserButton, useUser, useAuth } from "@clerk/react";
// import PageLoader from "./components/PageLoader";
// import Layout from "./components/Layout";

// const App = () => {
//   const { isSignedIn } = useUser();

//   const { isLoaded } = useAuth();
//   if (!isLoaded) return <PageLoader />
//   return (
//     <Layout>
//       <div>
//         {!isSignedIn ? (
//           <>
//             <SignInButton mode="modal" />
//             <SignUpButton />
//           </>
//         ) : (
//           <UserButton />
//         )}
//       </div>

//       <div className="text-7xl">
//         <button className="btn btn-success">Success</button>
//         App
//         <button className="btn btn-primary">Click Here</button>
//       </div>
//       <button className="btn btn-secondary">Click Here</button>
//       <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
//         Responsive
//       </button>
//       <button className="btn btn-error">Error</button>
//     </Layout>
//   );
// };

// export default App;

import { SignInButton, SignUpButton, UserButton, useUser, useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";

const App = () => {

  const { isLoaded } = useAuth();

  return (
    <Layout>

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>

    </Layout>
  )
}

export default App
