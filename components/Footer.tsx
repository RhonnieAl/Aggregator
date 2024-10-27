import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content p-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Crypto Ai Memecoins. All rights
          reserved.
        </p>
        <p>
          Would love to see more Data? Let us know:{" "}
          <a
            href="mailto:cryptoaimemecoins@gmail.com"
            className="text-primary underline">
            cryptoaimemecoins@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
