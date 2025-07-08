import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/2560px-Shopee.svg.png" 
            alt="Shopee Logo" 
            className="h-8 cursor-pointer"
          />
        </Link>
        <div className="hamburger-menu cursor-pointer">
          <div className="hamburger-line w-[16px] h-[3px] bg-[#EE4D2D] my-1 transition-all duration-400"></div>
          <div className="hamburger-line w-[20px] h-[3px] bg-[#EE4D2D] my-1 transition-all duration-400"></div>
          <div className="hamburger-line w-[24px] h-[3px] bg-[#EE4D2D] my-1 transition-all duration-400"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;