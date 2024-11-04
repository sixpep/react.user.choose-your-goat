import React, { useState } from "react";
import Tile from "../Tile Component/Tile";

const TileCarousel = ({ goatsData, order, setOrder }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? goatsData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === goatsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const sample = {
    docId: "sampleDoc123",
    goatImage: "/images/goat1.jpeg",
    gender: "Male",
    netWeight: 30,
    meatOnlyWeight: 25,
    totalShares: 100,
    approxShareSize: 250,
    perShareCost: 500,
    cutSize: "Medium",
    headLegsBrainPrice: 200,
    headPrice: 100,
    legsPrice: 100,
    brainPrice: 80,
    botiShareCost: 150,
    extraCost: 50,
    deliveryDateTimestamp: Date.now(),
    totalBotiShares: 20,
    remainingBotiShares: 15,
    headLegsBrainAvailability: true,
    headAvailability: true,
    brainAvailability: true,
    legsAvailability: true,
    remainingShares: 40,
    remainingExtraShares: 5,
  };

  return (
    <div
      id="default-carousel"
      className="relative w-full h-auto overflow-x-hidden"
      data-carousel="slide"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {goatsData.map((item, index) => {
          return (
            <div className="min-w-full" data-carousel-item key={index}>
              <Tile
                docId={item.docId}
                goatImage={item.goatImage}
                gender={item.gender}
                netWeight={item.netWeight}
                meatOnlyWeight={item.meatOnlyWeight}
                totalShares={item.totalShares}
                approxShareSize={item.approxShareSize}
                perShareCost={item.perShareCost}
                cutSize={item.cutSize}
                headLegsBrainPrice={item.headLegsBrainPrice}
                headPrice={item.headPrice}
                legsPrice={item.legsPrice}
                brainPrice={item.brainPrice}
                botiShareCost={item.botiShareCost}
                extraCost={item.extraCost}
                deliveryDateTimestamp={item.deliveryDateTimestamp}
                totalBotiShares={item.totalBotiShares}
                remainingBotiShares={item.remainingBotiShares}
                headLegsBrainAvailability={item.headLegsBrainAvailability}
                headAvailability={item.headAvailability}
                brainAvailability={item.brainAvailability}
                legsAvailability={item.legsAvailability}
                remainingShares={item.remainingShares}
                remainingExtraShares={item.remainingExtraShares}
                order={order}
                setOrder={setOrder}
              />
            </div>
          );
        })}
        <Tile
          docId={sample.docId}
          goatImage={sample.goatImage}
          gender={sample.gender}
          netWeight={sample.netWeight}
          meatOnlyWeight={sample.meatOnlyWeight}
          totalShares={sample.totalShares}
          approxShareSize={sample.approxShareSize}
          perShareCost={sample.perShareCost}
          cutSize={sample.cutSize}
          headLegsBrainPrice={sample.headLegsBrainPrice}
          headPrice={sample.headPrice}
          legsPrice={sample.legsPrice}
          brainPrice={sample.brainPrice}
          botiShareCost={sample.botiShareCost}
          extraCost={sample.extraCost}
          deliveryDateTimestamp={sample.deliveryDateTimestamp}
          totalBotiShares={sample.totalBotiShares}
          remainingBotiShares={sample.remainingBotiShares}
          headLegsBrainAvailability={sample.headLegsBrainAvailability}
          headAvailability={sample.headAvailability}
          brainAvailability={sample.brainAvailability}
          legsAvailability={sample.legsAvailability}
          remainingShares={sample.remainingShares}
          remainingExtraShares={sample.remainingExtraShares}
          order={order}
          setOrder={setOrder}
        />
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="true"
          aria-label="Slide 1"
          data-carousel-slide-to="0"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 2"
          data-carousel-slide-to="1"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 3"
          data-carousel-slide-to="2"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 4"
          data-carousel-slide-to="3"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 5"
          data-carousel-slide-to="4"
        ></button>
      </div>

      <button
        type="button"
        className="fixed top-24 start-0 flex justify-center h-min px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full  bg-gray-800 text-white border border-gray-600 shadow-lg bg-white/30">
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
        className="fixed top-24 end-0 flex justify-center h-min px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full border border-gray-600 shadow-lg bg-white/30">
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
      </button>
    </div>
  );
};

export default TileCarousel;
