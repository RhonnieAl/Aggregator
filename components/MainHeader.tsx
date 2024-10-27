import React from "react";

const Header = () => {
  return (
    <header className="bg-base-200 text-base-content p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary ">
          Crypto Ai Memecoins
        </h1>
        {/* Add navigation links here if needed */}
        {/* <nav>
          <a href="#" className="mr-4 text-primary hover:text-primary-content">Home</a>
          <a href="#" className="text-primary hover:text-primary-content">About</a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
