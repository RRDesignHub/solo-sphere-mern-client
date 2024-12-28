import axios from "axios";
import { compareAsc, format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(new Date());
  const [jobDetails, setJobDetails] = useState({});
  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/job/${id}`);
    setJobDetails(data);
  };
  const {
    _id,
    jobTitle,
    deadline,
    jobCategory,
    buyer,
    minPrice,
    maxPrice,
    jobDescription,
    bid_count,
  } = jobDetails;

  // handle submit bid for job:
  const handleBidTheJob = async (e) => {
    e.preventDefault();

    const form = e.target;
    const bidPrice = form.price.value;
    const bidderEmail = form.email.value;
    const bidderComment = form.comment.value;
    const jobId = _id;
    // deadline validation:
    if (compareAsc(new Date(), new Date(deadline)) === 1) {
      return toast.error("Deadline crossed, Bidding forbiden");
    }

    // validation for job publisher can't bid for the job:
    if (buyer.email === user?.email) {
      return toast.error("Publisher can't bid for his published job!!!");
    }
    // deadline validation:
    if (compareAsc(new Date(startDate), new Date(deadline)) === 1) {
      return toast.error("Offer within deadline!!!");
    }
    // price validation for crossing max price:
    if (bidPrice > maxPrice) {
      return toast.error("Bid for less or equal price of the job!!!");
    }

    const bidData = {
      jobTitle,
      biddingDate: startDate,
      bidPrice,
      jobCategory,
      status: "Pending",
      bidderEmail,
      bidderName: user?.displayName,
      buyerEmail: buyer?.email ,
      bidderComment,
      jobId,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API}/addBid`, bidData);
      form.reset();
      toast.success("Successfully bid for the Job!");
      navigate("/my-bids");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        // Show the error message returned from the server
        toast.error(err.response.data.message);
      } else {
        // Handle unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto ">
      {/* Job Details */}
      <div className="flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
        <div className="flex items-center justify-between">
          {deadline && (
            <span className="text-sm font-light text-gray-800 ">
              Deadline: {format(new Date(deadline), "P")}
            </span>
          )}
          <span
            className={`px-4 py-1 text-xs ${
              jobCategory === "Graphics Design"
                ? "bg-blue-200 text-blue-800"
                : jobCategory === "Web Development"
                ? "bg-green-200 text-green-800"
                : jobCategory === "Digital Marketing"
                ? "bg-red-200 text-red-800"
                : "" // Fallback case
            } uppercase rounded-full`}
          >
            {jobCategory}
          </span>
        </div>

        <div>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800 ">
            {jobTitle}
          </h1>

          <p className="mt-2 text-lg text-gray-600 ">{jobDescription}</p>
          <p className="mt-6 text-sm font-bold text-gray-600 ">
            Buyer Details:
          </p>
          <div className="flex items-center gap-5">
            <div>
              <p className="mt-2 text-sm  text-gray-600 ">
                Name: {buyer?.name}
              </p>
              <p className="mt-2 text-sm  text-gray-600 ">
                Email: {buyer?.email}
              </p>
            </div>
            <div className="rounded-full object-cover overflow-hidden w-14 h-14">
              <img referrerPolicy="no-referrer" src={buyer?.photo} alt="" />
            </div>
          </div>
          <p className="mt-6 text-lg font-bold text-gray-600 ">
            Range: ${minPrice} - ${maxPrice}
          </p>
        </div>
      </div>
      {/* Place A Bid Form */}
      <section className="p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
        <h2 className="text-lg font-semibold text-gray-700 capitalize ">
          Place A Bid
        </h2>

        <form onSubmit={handleBidTheJob}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700 " htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="text"
                name="price"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-700 " htmlFor="emailAddress">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                name="email"
                defaultValue={user?.email}
                disabled
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-700 " htmlFor="comment">
                Comment
              </label>
              <input
                id="comment"
                name="comment"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="text-gray-700">Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className="border p-2 rounded-md"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Place Bid
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default JobDetails;
