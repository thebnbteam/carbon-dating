import { FaCommentAlt, FaSearch, FaHeart, FaUser } from "react-icons/fa";

export const StickyShortcuts = () => {
  return (
    <>
      <div className="fixed bottom-0 max-w-md w-11/12 bg-orange-200 my-2 py-3 border-solid border-2 border-white rounded-lg flex justify-around">
        <FaSearch className=" text-white bg-orange-200 text-2xl" />
        <FaHeart className=" text-white bg-orange-200 text-2xl" />
        <FaCommentAlt className="text-white bg-orange-200 text-2xl" />
        <FaUser className="text-white bg-orange-200 text-2xl" />
      </div>
    </>
  );
};
