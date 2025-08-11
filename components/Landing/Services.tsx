import {
  Car,
  ChevronLeft,
  ChevronRight,
  Hotel,
  Navigation,
  Plane,
  Sunrise,
  Utensils,
} from "lucide-react";
import React from "react";

interface ActivityCard {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
}

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

  const activities: ActivityCard[] = [
    {
      id: 1,
      title: "Snorkeling",
      category: "Activities",
      price: "From ₹6,939",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Day Trips",
      category: "Activities",
      price: "From ₹1,798",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Kashmiri Lakes",
      category: "Attractions",
      price: "From ₹2,065",
      image:
        "https://plus.unsplash.com/premium_photo-1661962871593-8c3dde633373?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Cruises & Sailing",
      category: "Activities",
      price: "From ₹6,198",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    },
  ];

  return (
    <>
      <section>
        <div className="max-w-7xl mx-auto p-6 bg-white">
          {/* Header */}
          <h1 className="text-5xl text-center font-bold text-gray-900 mb-8">
            Get Inspired
          </h1>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="relative rounded-2xl overflow-hidden h-80 cursor-pointer group"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activity.image})` }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 text-white">
                  {/* Category Badge */}
                  <div className="self-start">
                    <span className="px-3 py-1 text-xs font-medium bg-black bg-opacity-30 rounded-full backdrop-blur-sm">
                      {activity.category}
                    </span>
                  </div>

                  {/* Title and Price */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold leading-tight">
                      {activity.title}
                    </h3>
                    <p className="text-sm font-medium opacity-90">
                      {activity.price}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 flex justify-center items-center flex-col">
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
    </>
  );
};

export default Services;
