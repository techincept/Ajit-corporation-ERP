import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("i"));

  const config = {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  const [details, setDetails] = useState({});
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await axios.get(
      "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/admin/",
      config
    );
    setUsers(data);
  };

  // const handleLogIn = async () => {
  //   const config = {
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //   };
  //   try {
  //     const { data } = await axios.post(
  //       "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/admin/login",
  //       loginData,
  //       config
  //     );
  //     localStorage.setItem("i", JSON.stringify(data.t));
  //     setDetails(data.details);
  //     setLoginData({ email: "", password: "" });
  //     navigate("/");
  //     toast.success("You are login successfully.");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error);
  //   }
  // };
  useEffect(() => {
    fetchUsers();
  }, [details]);
  useEffect(() => {
    setDetails(JSON.parse(localStorage.getItem("d")));
  }, []);

  return (
    <UserContext.Provider value={{ details, setDetails, users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useDetails = () => useContext(UserContext);

export default UserContextProvider;
