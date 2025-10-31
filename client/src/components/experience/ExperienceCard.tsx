import React from 'react'
import { Link } from 'react-router-dom';

interface ExperienceCardProps {
  id?: string;
  image: string;
  title: string;
  location: string;
  description: string;
  price: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({id, image, title, location, description, price}) => {
  return (
    <article className='w-70 flex flex-col rounded-xl overflow-hidden '>
        <div className='w-full h-[170px]'>
            <img src={image} alt='experience image' className='w-full h-full object-cover'/>
        </div>
        <div className='w-full h-full flex flex-col justify-between flex-1 gap-5 px-4 py-3 bg-[#F0F0F0]'>
            <div className='w-full flex flex-col gap-3'>
                <div className='w-full flex justify-between items-center '>
                    <h2 className='text-[16px] font-medium'>{title}</h2>
                    <p className='px-2 py-1 bg-[#D6D6D6] rounded-sm text-[11px] font-medium'>{location}</p>
                </div>
                <p className='text-[12px] text-[#6C6C6C]'>{description}</p>
            </div>
            <div className='w-full flex justify-between items-center'>
                <p className='text-[12px] flex items-center gap-1'>From <span className='text-xl font-medium'>₹{price}</span></p>
                <Link to={`/experience/${id}`} className='px-2 py-1.5 bg-[#FFD643] font-medium text-[14px]'>View Details</Link>
            </div>
        </div>
    </article>
  )
}

export default ExperienceCard