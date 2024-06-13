import { useState } from "react";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home1 from "./pages/home/home1";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import AuthProvider from "./context/auth-context";
import ProtectedPage from "./pages/protected-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <ProtectedPage />,
    children: [
      {
        path: "/home",
        element: <Home1 />,
      },
    ],
  },
]);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
