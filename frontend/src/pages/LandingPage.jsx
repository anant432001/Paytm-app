import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-lg bg-white w-80 text-center p-6">
          <Heading label={"Welcome to Paytm"} />
          <SubHeading label={"Your one-stop solution for all payments"} />
          <div className="pt-4">
            <Button onClick={() => navigate("/signin")} label={"Sign in"} />
          </div>
        </div>
      </div>
    </div>
  );
};
