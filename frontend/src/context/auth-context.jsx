import supabase from "@/config/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
  signUp: (email, password, username) => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("session onAuthStateChange: ", _event);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, firstName, lastName, callback) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        redirectTo: "hhttp://localhost:5173/home",
        data: {
          name: firstName + " " + lastName,
        },
      },
    });
    console.log("data: ", data);
    console.log("error: ", error);
    callback();
    return { data, error };
  };

  const signInWithEmailAndPassword = async (email, password, callback) => {
    console.log("logging in with email and password", email, password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("data: ", data);
    console.log("error: ", error);
    callback();
    return { data, error };
  };

  // In case we want to manually trigger a signIn (instead of using Auth UI)
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { skipBrowserRedirect: false },
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error: ", error);
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, signUp, signInWithEmailAndPassword }}
    >
      {!loading ? children : `<div>Loading...</div>`}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
