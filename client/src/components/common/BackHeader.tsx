import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // install if not already: npm i lucide-react

interface BackHeaderProps {
  title: string;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto flex items-center gap-2 py-3 ">
      <button
        onClick={() => navigate(-1)}
        className="p-1 rounded-full hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-5 h-5 text-black" />
      </button>
      <h1 className="text-[16px] font-medium text-black">{title}</h1>
    </div>
  );
};

export default BackHeader;
