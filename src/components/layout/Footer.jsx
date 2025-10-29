import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">WhatsThatBrick?</h3>
            <p className="text-sm">
              The community-driven LEGO parts catalog. Identify, catalog, and share your LEGO brick knowledge.
            </p>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/search" className="hover:text-white">Browse Catalog</Link></li>
              <li><Link to="/submit" className="hover:text-white">Submit Part</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div> */}

          {/* Community */}
          {/* <div>
            <h3 className="text-white font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/guidelines" className="hover:text-white">Guidelines</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div> */}

          {/* Connect */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <p>Contact me in these places to give feedback or suggestions.</p>
              <a href="https://github.com/" target="_blank"className="hover:text-white">
                <Github size={24} />
              </a>
              <a href="https://x.com/zpperz" target="_blank" className="hover:text-white">
                <Twitter size={24} />
              </a>
              <a href="mailto:muadzsocute@gmail.com" className="hover:text-white">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 WhatsThatBrick? All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}