import { SigninInput } from "@devxbipin/medium--common";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabeledInput from "./LabeledInput";
import axios from "axios";
import { BACKEND_URL } from "../config";
const Authsingin = () => {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState<SigninInput>({
        email:"",
        password:""
    })

    const sendRequest = async ()=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,inputs)
            localStorage.setItem('token',res.data.token)
            navigate('/blogs');
        } catch (error) {
            alert("Something went wrong")
        }
    }
      return (
        <div className=" h-screen flex justify-center items-center">
          {/* {JSON.stringify(inputs)} */}
          <div className= " w-full max-w-lg px-10">
            <p className=" text-3xl font-extrabold">Signin to your account</p>
            <p className=" text-slate-500 ">
              Don't have an account?{" "}
              <Link to={"/signup"} className="pl-2 underline">
                Signup
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
              <button onClick={sendRequest} className="w-full mt-4 rounded-md outline-none bg-black py-2 text-white font-bold">Sign in</button>
          </div>
        </div>
      )
}

export default Authsingin
