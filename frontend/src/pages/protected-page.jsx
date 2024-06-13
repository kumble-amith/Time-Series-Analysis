import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedPage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);

    if (user === null) {
      navigate("/");
    }
  }, []);

  return <Outlet />;
}
