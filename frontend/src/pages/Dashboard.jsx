import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [myBalance, setMyBalance] = useState([0]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setMyBalance(response.data.balance);
      });
  }, []);

  

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={myBalance} />
        <Users />
      </div>
    </div>
  );
};
