import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">YouTube Summarizer</h2>
            <p className="text-gray-300 mt-2">Get concise summaries of your favorite YouTube videos</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} YouTube Summarizer</p>
            <p className="text-gray-400 text-sm mt-1">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;