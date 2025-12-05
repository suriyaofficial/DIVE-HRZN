import { Carousel, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getHomepageBanner } from "../services/api";

const CarouselBanner = () => {
  const {
    data: images,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homepagebanner"],
    queryFn: getHomepageBanner,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !images || images.length === 0) {
    return <p className="text-center text-red-600">Failed to load banner</p>;
  }

  return (
    <Carousel
      arrows
      infinite
      autoplay
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
              width: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBanner;
