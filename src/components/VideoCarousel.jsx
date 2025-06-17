import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AltrozVideo from '../media/altroz.mp4';
import CarsImage from '../media/cars.jpg';
import TrucksImage from '../media/trucks.jpg';

const VideoCarousel = () => {
  const swiperRef = useRef(null);
  const videoRef = useRef(null);

  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.realIndex;

    if (currentIndex === 1) {
      // Video slide
      swiper.autoplay.stop();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        videoRef.current.onended = () => {
          swiper.slideNext();
          swiper.autoplay.start();
        };
      }
    } else {
      // Image slides
      swiper.autoplay.start();
    }
  };

  return (
    <div
      className="carousel-wrapper"
      style={{
        width: '100%',
        maxWidth: '1050px',
        margin: '6px auto',
        aspectRatio: '16/9',
        background: '#000',
      }}
    >
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Slide 1 - Image */}
        <SwiperSlide>
          <img
            src={CarsImage}
            alt="Cars"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              aspectRatio: '16/9',
              display: 'block',
            }}
          />
        </SwiperSlide>

        {/* Slide 2 - Video */}
        <SwiperSlide>
          <video
            ref={videoRef}
            src={AltrozVideo}
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              aspectRatio: '16/9',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </SwiperSlide>

        {/* Slide 3 - Image */}
        <SwiperSlide>
          <img
            src={TrucksImage}
            alt="Trucks"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              aspectRatio: '16/9',
              display: 'block',
            }}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default VideoCarousel;
