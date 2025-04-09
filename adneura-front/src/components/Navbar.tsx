import { useAuth } from "@/context/AuthContextProvider";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = ({ isHome }: { isHome?: boolean }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={` flex flex-col ${isHome ? "mx-48" : "container mx-auto"}`}>
      <div className="flex items-center justify-between my-6 gap-3 w-full">
        <div className="flex items-center justify-start gap-3">
          <Brain size={48} />
          <span className="text-2xl font-semibold text-black-800 ">
            AdNeura
          </span>
        </div>
        <div>
          <Button variant={"outline"} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
