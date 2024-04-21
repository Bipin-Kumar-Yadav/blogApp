import { ChangeEvent } from "react"

// interface labelledInput{} // this can also be use

type labelledInput = {
    type: string,
    label : string,
    placeholder :string,
    onChange : (e:ChangeEvent<HTMLInputElement>)=> void,
}

const LabeledInput = ({type,label,placeholder,onChange}:labelledInput) => {

  return (
    <div className="mt-4 w-full">
      <label className="block mb-2 text-sm font-medium text-slate-500">
        {label}
      </label>
      <input
        type={type}
        id={label}
        onChange={onChange}
        className="bg-gray-50 font-medium border border-gray-300 text-gray-900 text-sm rounded-md
         focus:ring-blue-500  foucs:border-blue-500 block w-full p-2.5
         "
         placeholder={placeholder} 
         required
      />
    </div>
  )
}

export default LabeledInput
