import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
       <CategoryList/>
       <BannerProduct/>
       <HorizontalCardProduct category={"Airpodes"} heading={"Top's Airpodes"}/>
       <HorizontalCardProduct category={"  Mouse"} heading={"Top's Mouse"}/>
       <HorizontalCardProduct category={" Refrigerator"} heading={"Top's TV"}/>
       <VerticalCardProduct category={" Refrigerator"} heading={"Top's TV"}/>
       <VerticalCardProduct category={"Airpodes"} heading={"Top's TV"}/>
       <VerticalCardProduct category={"Airpodes"} heading={"Top's TV"}/>
       <VerticalCardProduct category={"Airpodes"} heading={"Top's TV"}/>
       <VerticalCardProduct category={" Refrigerator"} heading={"Top's TV"}/>
       <VerticalCardProduct category={" Refrigerator"} heading={"Top's TV"}/>
    </div>
  )
}

export default Home
