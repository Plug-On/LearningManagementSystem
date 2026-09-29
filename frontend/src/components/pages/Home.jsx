import React from 'react'
import Layout from '../common/Layout'
import Hero from '../common/Hero'
import FeaturedCategories from '../common/FeaturedCategories'
import FeaturedCourses from '../common/FeaturedCourses'
import PopularCourses from '../common/PopularCourses'
import HighestRatedCourses from '../common/HighestRatedCourses'
import LatestCourses from '../common/LatestCourses'

const Home = () => {
  return (
    <div>
        
        <Layout>


          <Hero/>
          <FeaturedCategories/>
          {/* <FeaturedCourses/> */}
          <PopularCourses/>
          <HighestRatedCourses/>
          <LatestCourses/>

        </Layout>

    </div>
  )
}

export default Home