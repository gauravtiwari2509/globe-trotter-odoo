import { Car, Hotel, Navigation, Plane, Sunrise, Utensils } from "lucide-react";
import React from "react";

const Services = () => {
  const services = [
    {
      icon: <Hotel />,
      title: "Hotel",
      description: "Luxurious hotel accommodations tailored to your needs.",
    },
    {
      icon: <Car />,
      title: "Car Rental",
      description: "Seamless booking and management of your car rental needs.",
    },
    {
      icon: <Plane />,
      title: "Flight Booking",
      description: "Hassle-free flight bookings to your favorite destinations.",
    },
    {
      icon: <Utensils />,
      title: "Restaurants",
      description: "Discover and book the best restaurants in your area.",
    },
    {
      icon: <Sunrise />,
      title: "Experiences",
      description:
        "Unforgettable experiences and activities tailored just for you.",
    },
    {
      icon: <Navigation />,
      title: "Tours",
      description:
        "Explore the world with our curated tours and travel packages.",
    },
  ];

  return (
    <section className="py-40 flex justify-center items-center flex-col">
      <h1 className="text-5xl font-bold mb-20">
        Organize it all in one place.
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full max-w-7xl">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-100 p-10 rounded-2xl">
            <div className="icon">{service.icon}</div>
            <h2 className="font-bold text-2xl mt-4 mb-2">{service.title}</h2>
            <p className="text-lg">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
