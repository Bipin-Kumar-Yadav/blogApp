import { Link, useNavigate } from "react-router-dom";
import LabeledInput from "./LabeledInput";
import { useState } from "react";
import { SignupInput } from "@devxbipin/medium--common";
import axios from "axios";
import { BACKEND_URL } from "../config";

const Auth = () => {
    const navigate = useNavigate();
  const [inputs, setInputs] = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });


  const sendRequest = async ()=>{
    try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,inputs);
        navigate('/signin')
        console.log(res);
    } catch (error) {
        alert("Something went wrong"); 
    }
  }



  return (
    <div className=" h-screen flex justify-center items-center ">
      {/* {JSON.stringify(inputs)} */}
      <div className= " w-full max-w-lg px-10">
        <p className=" text-3xl font-extrabold">Create an account</p>
        <p className=" text-slate-500 ">
          Already have an account?{" "}
          <Link to={"/signin"} className="pl-2 underline">
            Signin
          </Link>
        </p>
        <LabeledInput
          type="text"
          label="Email"
          placeholder="Email..."
          onChange={(e) => {
            setInputs({
              ...inputs,
              email: e.target.value,
            });
          }}
        />
        <LabeledInput
          type="password"
          label="Password"
          placeholder="Password..."
          onChange={(e) => {
            setInputs({
              ...inputs,
              password: e.target.value,
            });
          }}
        />
        <LabeledInput
          type="text"
          label="Name"
          placeholder="Name..."
          onChange={(e) => {
            setInputs({
              ...inputs,
              name: e.target.value,
            });
          }}
          />
          <button
          onClick={sendRequest} 
          className="w-full mt-4 rounded-md outline-none bg-black py-2 text-white font-bold"
          >
            Sign up</button>
      </div>
    </div>
  );
};

export default Auth;
