import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContextProvider";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const senhaInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const body = {
      email: emailInput.current?.value,
      password: senhaInput.current?.value,
    };
    try {
      const { data } = await api.post("auth/login/", body);
      if (data) {
        setIsLoading(false);
        login({
          ...data.user,
          access_token: data.access,
          refresh_token: data.refresh,
        });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen bg-white w-full container mx-auto">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-5">
            Welcome to AdNeura™
          </h1>
          <form
            className="flex flex-col w-96 p-5 gap-4"
            method="post"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-[#1E1E1E]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="block w-full px-3 py-2 mt-1 rounded-lg text-gray-900 border border-gray-300 outline-1 outline-gray-400 outline-offset-2 "
                ref={emailInput}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-[#1E1E1E]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg outline-1 outline-gray-400 outline-offset-2 "
                ref={senhaInput}
              />
            </div>
            <Button
              type="submit"
              className="w-1/3 self-end px-3 py-2 text-white bg-[#2C2C2C] rounded-md transition-all hover:bg-[#1E1E1E]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="text-lg mr-2 h-full w-full animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
