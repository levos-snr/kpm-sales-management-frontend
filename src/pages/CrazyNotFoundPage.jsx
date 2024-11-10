import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Ghost,
} from 'lucide-react';
import { Tooltip } from 'flowbite-react';

const CrazyNotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fourOhFour = document.getElementById('four-oh-four');
    fourOhFour.classList.add('animate-bounce');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div id="four-oh-four" className="text-9xl font-bold mb-8 relative">
        <span className="text-orange-500">4</span>
        <Ghost className="inline-block w-24 h-24 text-white animate-pulse" />
        <span className="text-orange-500">4</span>
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-orange-500 rounded-full animate-ping"></div>
      </div>

      <h1 className="text-4xl font-bold mb-4 animate-pulse">Oops!</h1>
      <p className="text-xl mb-8">
        We can't seem to find the page you are looking for
      </p>

      <button
        onClick={() => navigate(-1)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-110"
      >
        Back to Homepage
      </button>

      <div className="mt-16">
        <p className="mb-4">Follow us on</p>
        <div className="flex space-x-4">
          {[Instagram, Facebook, Linkedin, Twitter, Youtube].map(
            (Icon, index) => (
              <Tooltip key={index} content={Icon.name} placement="top">
                <Icon className="w-8 h-8 text-gray-400 hover:text-orange-500 transition-colors duration-300 cursor-pointer" />
              </Tooltip>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CrazyNotFoundPage;
