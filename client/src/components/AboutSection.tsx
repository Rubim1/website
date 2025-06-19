import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/contexts/AppContext";
import { createRipple } from "@/lib/microInteractions";

// Values for the class
const values = [
  "Excellence in everything we do",
  "Respect for each other and our teachers",
  "Collaboration and teamwork",
  "Creativity and innovation",
  "Perseverance and determination",
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const starVariants = {
  animate: {
    rotate: [0, -10, 10, -5, 5, 0],
    scale: [1, 1.2, 0.9, 1.1, 1],
    transition: { duration: 0.6 },
  },
};

const AboutSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const togethernessVideoRef = useRef<HTMLVideoElement>(null);
  const { openImageModal } = useAppContext();

  // Function to handle video click
  const handleVideoClick = (
    videoElement: HTMLVideoElement | null,
    title: string,
  ) => {
    if (videoElement) {
      // Pause video
      videoElement.pause();

      // Get video source
      const videoSrc = videoElement.currentSrc || videoElement.src;

      // Open in modal with controls
      openImageModal(
        videoSrc,
        title,
        "Click to play/pause. Use the controls to adjust volume and playback.",
      );
    }
  };

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Background pattern with parallax */}
      <div
        className="absolute inset-0 parallax-bg z-0 opacity-5 parallax-slow"
        data-parallax="0.3"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522661067900-ab829854a57f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-orbitron font-bold text-white pb-2">
            About <span className="seven-text">Class 7A</span>
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-2 mb-6"></div>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            We are 7 Amazing, a class of talented and dedicated students
            striving for excellence in everything we do.
          </p>
        </motion.div>

        {/* Mission & Values */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-black/50 backdrop-blur-md rounded-xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 border border-white/10"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-semibold text-accent mb-4">
              Our Mission
            </h3>
            <p className="text-gray-300">
              To create a supportive learning environment where every student
              can thrive academically and personally.
            </p>
          </motion.div>

          <motion.div
            className="bg-black/50 backdrop-blur-md rounded-xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 border border-white/10"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-semibold text-accent mb-4">
              Our Values
            </h3>
            <ul className="text-gray-300 space-y-3">
              {values.map((value, index) => (
                <motion.li
                  key={index}
                  className="flex items-center group p-2 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer ripple-container"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => createRipple(e)}
                >
                  <motion.div
                    className="mr-3 text-accent"
                    whileHover={{
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      transition: { duration: 0.6 },
                    }}
                  >
                    <motion.i
                      className="fas fa-star"
                      style={{ display: "inline-block" }}
                    />
                  </motion.div>

                  <motion.span
                    whileHover={{
                      color: "#fff",
                      textShadow: "0 0 5px rgba(0, 191, 255, 0.5)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {value}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Class Video - Replacing Student Data */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-center text-accent mb-6">
            Our Class in Action
          </h3>

          <div className="mx-auto max-w-4xl">
            <div
              className="relative rounded-xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg"
              onClick={() =>
                handleVideoClick(videoRef.current, "Class 7A - DJ Tie Me Down")
              }
            >
              {/* Video element */}
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                src="https://rubim1.github.io/video/[16_9]%20DJ%20Tie%20Me%20Down%20X%20Kawenimerry%20X%20Ena%20Ena%20Rawi%20Djaffar%20🎼🎵%20[31D588F].mp4"
                muted
                loop
                autoPlay
                playsInline
              ></video>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center">
                  <i className="fas fa-play text-white text-2xl"></i>
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h4 className="text-white font-semibold">
                  DJ Tie Me Down X Kawenimerry X Ena Ena
                </h4>
                <p className="text-gray-300 text-sm">
                  Click to view with sound
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Together We Learn section with video */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Together We Learn, Together We Excel
            </h3>

            <div
              className="relative rounded-xl overflow-hidden group cursor-pointer mb-6"
              onClick={() =>
                handleVideoClick(
                  togethernessVideoRef.current,
                  "Class 7A - Togetherness",
                )
              }
            >
              {/* Video element */}
              <video
                ref={togethernessVideoRef}
                className="w-full aspect-video object-cover"
                src="https://rubim1.github.io/video/kontol.mp4"
                muted
                loop
                autoPlay
                playsInline
              ></video>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center">
                  <i className="fas fa-play text-white text-2xl"></i>
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-300">
              At Class 7A, we believe in the power of togetherness. Our journey
              of learning and growth is shared, making every achievement a
              collective success.
            </p>

            <div className="mt-6">
              <a
                href="#gallery"
                className="inline-block bg-accent hover:bg-accent/80 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                See More Memories <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Homeroom Teacher Section */}
        <motion.div
          className="text-center mt-16 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-accent mb-6">
            Our Homeroom Teacher
          </h3>

          <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-pulse-slow"></div>
                <motion.div
                  className="w-full h-full rounded-full overflow-hidden border-2 border-accent/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="https://rubim1.github.io/video/walikelas.jpg"
                    alt="Siti Usalawati, S.Pd"
                    className="w-full h-full object-cover"
                    onClick={() =>
                      openImageModal(
                        "https://rubim1.github.io/video/walikelas.jpg",
                        "Siti Usalawati, S.Pd",
                        "Our dedicated homeroom teacher for Class 7A",
                      )
                    }
                  />
                </motion.div>
                <div className="absolute inset-0 rounded-full border-2 border-accent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <motion.h4
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Siti Usalawati, S.Pd
              </motion.h4>

              <motion.p
                className="text-xl text-accent mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Wali Kelas 7A
              </motion.p>

              <motion.p
                className="text-gray-300 max-w-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Our dedicated homeroom teacher who guides us through our
                educational journey with patience, wisdom, and care.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
