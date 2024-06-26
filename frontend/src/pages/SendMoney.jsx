import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";

export const SendMoney = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }

  const [transferAmount, setTransferAmount] = useState(0);
  const [transferSuccess, setTransferSuccess] = useState(false); // State for success message

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");

  async function onclickHandler() {
    await axios
      .post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          amount: transferAmount,
          to: id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response.status);
        if (response.status == 200) {
          setTransferSuccess(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      });
  }

  return (
    <>
      <Appbar />
      <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center ">
          <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="text-3xl font-bold text-center">Send Money</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-2xl text-white">
                    {firstName[0] + lastName[0]}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold">{`${firstName} ${lastName}`}</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="amount">
                    Amount (in Rs)
                  </label>
                  <input
                    onChange={(e) => {
                      setTransferAmount(parseFloat(e.target.value));
                    }}
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id="amount"
                    placeholder="Enter amount"
                  />
                </div>
                <button
                  onClick={onclickHandler}
                  className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                  Initiate Transfer
                </button>
                {transferSuccess && (
                  <p className="text-green-600 text-center mt-2">
                    Transfer successful!
                    <br></br>
                    Redirecting to Dashboard
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
