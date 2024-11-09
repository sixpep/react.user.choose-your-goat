import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

const Carousel = ({ images, goatDescriptionVisible }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });
  return (
    <div
      id="default-carousel"
      className="relative w-full overflow-hidden"
      data-carousel="slide"
      {...handlers}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images?.map((imageSrc, index) => {
          return (
            <div
              key={index}
              className="min-w-full"
              style={{ position: "relative", height: "100%" }}
              data-carousel-item
            >
              <img
                src={imageSrc}
                alt="goat"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {images.map((_, ind) => {
          return (
            <button
              key={ind}
              type="button"
              className={`w-3 h-3 rounded-full ${
                goatDescriptionVisible || images.length < 2
                  ? "invisible"
                  : "visible"
              } ${ind === currentIndex ? "bg-gray-800" : "bg-gray-400"}`}
              aria-current={ind === currentIndex}
              aria-label={`Slide ${ind + 1}`}
              data-carousel-slide-to="0"
              onClick={() => setCurrentIndex(ind)}
            ></button>
          );
        })}
      </div>{" "}
      {/* <button
        type="button"
        className="absolute top-1/2 start-0 z-30 flex items-center justify-center h-min px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-gray-800/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-1/2 end-0 z-30 flex items-center justify-center h-min px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-gray-800/30 group-hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button> */}
    </div>
  );
};

export default Carousel;
