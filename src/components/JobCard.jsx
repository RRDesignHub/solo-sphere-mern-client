/* eslint-disable react/prop-types */

import { format} from "date-fns";
import { Link } from 'react-router-dom'

const JobCard = ({job}) => {
  const {
    _id,
    jobTitle, 
    deadline,
    jobCategory,
    minPrice,
    maxPrice,
    jobDescription,
    bid_count} = job;
  return (
    <Link
      to={`/job/${_id}`}
      className='w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all'
    >
      <div className='flex items-center justify-between'>
        <span className='text-xs font-light text-gray-800 '>
          Deadline: {format(new Date(deadline), "P")}
        </span>
        <span className={`px-4 py-1 text-xs ${
              jobCategory === "Graphics Design"
                ? "bg-blue-200 text-blue-800"
                : jobCategory === "Web Development"
                ? "bg-green-200 text-green-800"
                : jobCategory === "Digital Marketing"
                ? "bg-red-200 text-red-800"
                : "" // Fallback case
            } uppercase rounded-full`}>
          {jobCategory}
        </span>
      </div>

      <div>
        <h1 className='mt-2 text-lg font-semibold text-gray-800 '>
          {jobTitle}
        </h1>

        <p className='mt-2 text-sm text-gray-600 '>
          {jobDescription.slice(0, 100)}
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>
          Range: ${minPrice} - ${maxPrice}
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>Total Bids: {bid_count}</p>
      </div>
    </Link>
  )
}

export default JobCard
