import { assets } from "../assets/assets"

const Testimonial = () => {
    const dummyTestimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'John Doe',
            title: 'Marketing Director, TechCorp',
            content: 'This AI platform is absolutely game-changing! Our content quality has skyrocketed, and we\'ve reduced production time by 70%. The AI understands our brand voice perfectly and delivers consistent, engaging content every single time.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: 'Sarah Johnson',
            title: 'Content Creator & Influencer',
            content: 'Mind-blowing results! I was skeptical at first, but this AI has become my secret weapon. It helps me generate fresh ideas, write compelling captions, and even optimize my content for better engagement. My followers love the quality improvement!',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
            name: 'Emily Chen',
            title: 'Digital Marketing Specialist',
            content: 'Incredible AI technology! This platform has revolutionized our entire content strategy. From blog posts to social media content, everything is now faster, smarter, and more effective. Our engagement rates have increased by 150% since we started using it.',
            rating: 5,
        },
    ]

    return (
        <div className='relative px-4 sm:px-20 xl:px-32 py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden'>
            
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-violet-600/15 to-purple-700/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/8 to-violet-700/8 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-ping opacity-60" />
                <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-700 opacity-60" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-1000 opacity-60" />
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-indigo-400 rounded-full animate-ping delay-300 opacity-60" />
            </div>

            <div className='relative z-10 text-center'>
                <div className='relative inline-block'>
                    <h2 className='text-slate-100 text-[42px] font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient'>
                        Loved by Creators
                    </h2>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 blur-sm"></div>
                </div>
                <p className='text-slate-300 max-w-lg mx-auto mt-6 text-lg leading-relaxed'>
                    Don't just take our word for it. Here's what our users are saying.
                </p>
            </div>

            <div className='relative z-10 flex flex-wrap mt-16 justify-center gap-6'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div 
                        key={index} 
                        className='group relative p-8 max-w-sm rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl shadow-2xl border border-slate-700/50 hover:border-violet-500/30 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden'
                        style={{
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Card Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                        
                        <div className='relative z-10'>
                            {/* Star Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {Array(5).fill(0).map((_, starIndex) => (
                                    <div key={starIndex} className="relative">
                                        <img 
                                            src={starIndex < testimonial.rating ? assets.star_icon : assets.star_dull_icon} 
                                            className='w-5 h-5 brightness-125 hover:scale-110 transition-transform duration-200' 
                                            alt="star"
                                            style={{
                                                animationDelay: `${starIndex * 100}ms`
                                            }}
                                        />
                                        {starIndex < testimonial.rating && (
                                            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Testimonial Content */}
                            <p className='text-slate-300 text-sm my-6 leading-relaxed group-hover:text-slate-200 transition-colors duration-300 italic'>
                                "{testimonial.content}"
                            </p>

                            {/* Divider */}
                            <div className='mb-6 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent group-hover:via-violet-500/50 transition-all duration-500'></div>

                            {/* User Info */}
                            <div className='flex items-center gap-4'>
                                <div className='relative'>
                                    <img 
                                        src={testimonial.image} 
                                        className='w-12 h-12 object-cover rounded-full ring-2 ring-slate-600 group-hover:ring-violet-400 transition-all duration-300 shadow-lg' 
                                        alt={testimonial.name} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                                </div>
                                <div className='text-sm'>
                                    <h3 className='font-semibold text-slate-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-300'>
                                        {testimonial.name}
                                    </h3>
                                    <p className='text-slate-400 text-xs group-hover:text-slate-300 transition-colors duration-300'>
                                        {testimonial.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Corner Accents */}
                        <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                        
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 text-4xl text-slate-600 opacity-20 group-hover:opacity-40 transition-opacity duration-300">"</div>
                    </div>
                ))}
            </div>
            

        </div>
    )
}

export default Testimonial