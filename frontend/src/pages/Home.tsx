import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-700">YouTube Summarizer</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Never miss the key points from your favorite YouTube channels. Get concise summaries delivered straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/login" 
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <a 
            href="#how-it-works" 
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Sign in with Google</h3>
              <p className="text-gray-600">
                Connect with your Google account for a seamless experience and to receive email summaries.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Add Your Favorite Channels</h3>
              <p className="text-gray-600">
                Paste a YouTube channel link and we'll monitor it for new uploads automatically.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Receive Smart Summaries</h3>
              <p className="text-gray-600">
                Get text, audio, and mind-map summaries of new videos within minutes of publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lightning-Fast Processing</h3>
                <p className="text-gray-600">
                  Summary email reaches you within 5 minutes of a video being published.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Multiple Summary Formats</h3>
                <p className="text-gray-600">
                  Get TL;DR text, key takeaways, action items, audio summaries, and visual mind-maps.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email Delivery</h3>
                <p className="text-gray-600">
                  Summaries delivered straight to your inbox with no extra apps to install.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Customizable Experience</h3>
                <p className="text-gray-600">
                  Choose which channels to follow and which summary formats you prefer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-700 text-white w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to save time?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who stay informed without watching entire videos.
          </p>
          <Link
            to="/login"
            className="bg-white text-indigo-700 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Sign up now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;