import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiToools from '../components/AiToools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AiToools/>
      <Testimonial />
      <div id="pricing">
        <Plan/>
      </div>
      <Footer/>
    </>
  )
}

export default Home
