import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <>
      <section className="relative min-h-[50vh] w-full my-16">
        <Image
          src="/photogallery/footer.jpg"
          alt="Footer Image"
          fill
          objectFit="cover"
          className="absolute inset-0 -z-10 opacity-80"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative pt-20 z-10 flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join us and start your adventure today!
          </p>
          <a
            href="/signup"
            className="px-5 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            Sign Up Now
          </a>{" "}
        </div>
      </section>
      <footer className="bg-orange-300/20 text-gray-500 mx-28 py-4 rounded-t-2xl">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 GlobeTrotter. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
