import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/"); // Redirect to the homepage
    }
  }, [router]);

  return null;
};

export default Logout;
