import Authsingin from "../components/Authsingin"
import Quote from "../components/Quote"

const Signin = () => {
  return (
    <div className=" grid md:grid-cols-2">
        <Authsingin/>
        <div className="hidden md:block">
        <Quote/>
        </div>
    </div>
  )
}

export default Signin
