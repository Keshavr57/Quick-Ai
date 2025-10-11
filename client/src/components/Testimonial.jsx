import { assets } from "../assets/assets";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "This AI platform is absolutely game-changing! Our content quality has skyrocketed, and we've reduced production time by 70%. The AI understands our brand voice perfectly.",
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Sarah Johnson",
      title: "Content Creator & Influencer",
      content:
        "Mind-blowing results! This AI has become my secret weapon. It helps me generate fresh ideas, write captions, and even optimize content for engagement.",
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "Emily Chen",
      title: "Digital Marketing Specialist",
      content:
        "Incredible AI technology! Our content strategy is now faster, smarter, and more effective. Engagement rates have increased by 150% since using this tool.",
      rating: 5,
    },
  ];

  return (
    <div className="relative px-4 sm:px-20 xl:px-32 py-24 bg-gradient-to-b from-orange-50 via-white to-amber-50 overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/20 to-amber-100/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Header */}
      <div className="relative text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
          What Our <span className="text-orange-600">Users Say</span>
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto text-lg">
          Real voices from creators who boosted their productivity with our AI tools.
        </p>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 flex flex-wrap justify-center gap-8 mt-16">
        {dummyTestimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="group relative bg-white border border-orange-100 hover:border-orange-300 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 max-w-sm cursor-pointer hover:-translate-y-2"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 to-amber-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array(5)
                .fill(0)
                .map((_, starIndex) => (
                  <img
                    key={starIndex}
                    src={
                      starIndex < testimonial.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    alt="star"
                  />
                ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 text-sm leading-relaxed mb-6 italic group-hover:text-gray-800 transition-colors">
              “{testimonial.content}”
            </p>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent mb-6"></div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-200 group-hover:ring-orange-400 transition-all duration-300"
              />
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>

            {/* Floating Accents */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-orange-400 rounded-full opacity-40 group-hover:opacity-70 transition"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 bg-amber-400 rounded-full opacity-40 group-hover:opacity-70 transition"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
