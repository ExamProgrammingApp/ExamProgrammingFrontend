import React, { useEffect } from "react";

const FilterModal = ({ onClose, onSubmit }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1b1e3d] p-8 rounded-lg shadow-lg max-w-lg w-full text-white"
        role="dialog"
        aria-labelledby="assign-room-title"
        aria-describedby="assign-room-desc"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        <h1
          id="assign-room-title"
          className="text-3xl font-bold mb-8 text-center"
        >
          ARE YOU SURE ?
        </h1>
        <div className="flex justify-evenly">
          <button
            onClick={onClose}
            className="bg-orange-1 w-24 h-10 text-black text-2xl rounded hover:bg-white ease-in duration-300"
          >
            NO
          </button>
          <button
            onClick={handleSubmit}
            className="bg-white w-24 h-10 text-black text-2xl rounded hover:bg-orange-1 ease-in duration-300"
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
