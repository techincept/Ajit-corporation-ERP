import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDetails } from "../context/UserContext";
function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { setDetails } = useDetails();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((pre) => ({ ...pre, [name]: value }));
  };
  const handleLogIn = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/admin/login",
        loginData,
        config
      );
      localStorage.setItem("i", JSON.stringify(data.t));
      localStorage.setItem("d", JSON.stringify(data.details));

      setDetails(data.details);
      setLoginData({ email: "", password: "" });
      navigate("/");
      toast.success("You are login successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };
  return (
    <>
      <div className="flex h-[100vh] w-full text-white ">
        <ToastContainer />
        <div className="grid h-full w-1/3 justify-center bg-gray-500 text-center">
          <img
            className=" bg-gray-500"
            src="https://ajitcorporation.in/admin_dep/images/icon.png"
            alt=""
          />

          <div className="pt-60">
            <p className="mb-2 text-3xl ">Ajit Corporation ERP</p>
            <p className="italic">Ajit Corporation ERP</p>
          </div>
        </div>
        <div className=" mx-auto my-auto flex h-1/2 w-fit flex-col justify-between text-black">
          <p>SIGN IN TO USER</p>
          <div className="grid">
            <label className="mb-2 text-sm" htmlFor="emailAddress">
              EMAIL ADDRESS
            </label>
            <input
              onChange={handleChange}
              className=" w-80 border border-gray-200 p-2"
              type="email"
              placeholder="Email Address"
              name="email"
            />
          </div>
          <div className="grid">
            <label className="mb-2 text-sm" htmlFor="password">
              PASSWORD
            </label>
            <input
              onChange={handleChange}
              className=" w-80 border border-gray-200 p-2"
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>
          <button
            onClick={handleLogIn}
            className="rounded-full bg-[rgb(0,0,200)] py-3 text-white  duration-200 hover:bg-[rgb(0,0,90)]"
          >
            LOG IN{" "}
          </button>
        </div>
      </div>
      <span className="bg-white text-center fixed bottom-0 w-full block py-1">
        Developed with ❤️ by{" "}
        <a
          href="https://techincept.com/"
          target="blank"
          className="hover:underline"
        >
          Tech Incept
        </a>
        .
      </span>
    </>
  );
}

export default Login;
