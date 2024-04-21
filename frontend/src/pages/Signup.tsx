import Auth from "../components/Auth"
import Quote from "../components/Quote"

const Signup = () => {
  return (
    <div className=" grid  md:grid-cols-2">
      <div>
        <Auth/>
      </div>
      <div className="hidden md:block">
      <Quote/>
      </div>
    </div>
  )
}

export default Signup
