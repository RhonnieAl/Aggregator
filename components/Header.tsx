import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, description }) => {
  return (
    <div className="mb-8 text-center pt-8 mt-8">
      <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-4">
        {title}
      </h1>
      {subtitle && (
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">
          {subtitle}
        </h2>
      )}
      {description && (
        <p className="text-base sm:text-lg lg:text-xl mb-4">{description}</p>
      )}
    </div>
  );
};

export default Header;
