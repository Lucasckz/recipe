import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from "../images/cooking-5880136_1920.jpg";
import img2 from "../images/food-2068217_1920.jpg";
import img3 from "../images/mediterranean-cuisine-2378758_1920.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components';



class Home extends React.Component {
  render() {
    return (
      <div className="main">
        <Container className="container-fluid" >
          <div style={{ padding: 50 }}></div>
          <Carousel className="d-block w-100px" onClick={search}>
            
            <Carousel.Item>
              
              <img
                className="d-block w-100"
                src={img3}
                alt="First slide"
                href="../Search/Search.js"
              />
              
              <Carousel.Caption>
                <h1 style={{ fontSize: 70 }}> Welcome to PantryPal</h1>
                <h3>Just add ingredients and we will match you with recipes!</h3>
                
              </Carousel.Caption>
              
            </Carousel.Item>
            
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={img2}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h1 style={{ fontSize: 70 }}> Create a profile</h1>
                <h3>Save Recipes and your Preferences</h3>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={img1}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h1 style={{ fontSize: 70, color: 'black' }}> Need Help? </h1>
                <h3 style={{ color: 'black' }}> Contact us </h3>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
        <div style={{ padding: 50 }}></div>
      </div>
    );
  }
}
function search() {
  
}
export default Home;



