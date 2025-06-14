import React, { useContext, useEffect, useState } from "react";
import Tile from "../Tile Component/Tile";
import { Context } from "../../../App";

const TileCarousel = ({ order, setOrder }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { goatsData } = useContext(Context);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? goatsData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === goatsData.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div id="default-carousel" className="relative w-full h-auto overflow-x-hidden" data-carousel="slide">
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
                muttonShareCost={item.muttonShareCost}
                totalKeemaShares={item.totalKeemaShares}
                keemaShareCost={item.keemaShareCost}
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
                remainingHeads={item.remainingHeads}
                remainingBrains={item.remainingBrains}
                remainingLegs={item.remainingLegs}
                remainingMuttonShares={item.remainingMuttonShares}
                remainingKeemaShares={item.remainingKeemaShares}
                remainingExtras={item.remainingExtras}
                nextUnlockText={item.nextUnlockText}
                totalHeads={item.totalHeads}
                totalLegs={item.totalLegs}
                totalBrains={item.totalBrains}
                totalExtras={item.totalExtras}
                isActive={item.isActive}
                order={order}
                setOrder={setOrder}
                handlePrev={handlePrev}
                handleNext={handleNext}
              />
            </div>
          );
        })}
      </div>

      {/* <button
        type="button"
        className="absolute top-1/ start-8 flex justify-center h-min cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={handlePrev}
        style={{ zIndex: 5 }}
      >
        <i
          className="inline-flex items-center justify-center w-10 h-10"
          style={{ zIndex: 5 }}
        >
          <BsFillCaretLeftFill size={30} style={{ zIndex: "5" }} />
        </i>
      </button>

      <button
        type="button"
        className="absolute top-64 end-8 flex justify-center h-min cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={handleNext}
      >
        <i className="inline-flex items-center justify-center w-10 h-10 ">
          <BsFillCaretRightFill size={30} />
        </i>
      </button> */}
    </div>
  );
};

export default TileCarousel;

{
  /* <svg
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
        </svg> */
}
