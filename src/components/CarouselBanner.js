import React, { useRef } from "react";
import { Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
// import "antd/dist/antd.css"; // for antd v4
// import "antd/dist/reset.css"; // for antd v5

const images = [
  // replace with local imports like: import b1 from "../assets/banner1.jpg"
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80",
  "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1600&q=80",
];

const CarouselBanner = () => {
  return (
    <Carousel
      arrows
      infinite={true}
      autoplay={{ dotDuration: true }}
      autoplaySpeed={3000}
      dots
      effect="scrollx"
    >
      {images.map((src, idx) => (
        <div key={idx}>
          <img
            src={src}
            alt={`slide-${idx}`}
            style={{
              margin: 0,
              height: "90vh",
              width: "100vw",
            }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBanner;
