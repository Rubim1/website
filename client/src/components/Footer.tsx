import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="relative py-10 bg-background border-t border-primary/20">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-primary mb-4">7 Amazing</h3>
            <p className="text-gray-400 mb-4">A class of talented and dedicated students striving for excellence in everything we do.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </motion.div>
          
          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#schedule" className="text-gray-400 hover:text-primary transition-colors">Class Schedule</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-primary transition-colors">Gallery</a></li>
              <li>
                <a 
                  href="https://docs.google.com/spreadsheets/d/1DOFuQjICT47k1L5rqpxp3ety3M7JjkD5ncvNKM5T9JI/edit?gid=1424646149#gid=1424646149" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  E-Presensi
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-primary mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                <span className="text-gray-400">SMP Amazing School, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope text-primary mt-1 mr-3"></i>
                <span className="text-gray-400">7amazing@school.edu</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone text-primary mt-1 mr-3"></i>
                <span className="text-gray-400">+62 123 4567 890</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom section */}
        <motion.div 
          className="pt-8 border-t border-primary/10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-500">&copy; {new Date().getFullYear()} 7 Amazing Class. All rights reserved.</p>
          <p className="text-gray-500 mt-2">
            Designed with <i className="fas fa-heart text-red-500"></i> by Itsbymz(rubim)
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
