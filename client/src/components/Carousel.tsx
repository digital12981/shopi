import React, { useState, useEffect, useRef } from 'react';

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      url: "https://down-br.img.susercontent.com/file/br-11134258-7r98o-m21cpuqxu6ana5.webp",
      alt: "Shopee Delivery Image 1"
    },
    {
      url: "https://down-br.img.susercontent.com/file/br-11134258-7r98o-m21cqh315henad.webp",
      alt: "Shopee Delivery Image 2"
    },
    {
      url: "https://down-br.img.susercontent.com/file/br-11134258-7r98o-m21cqu20650kad.webp",
      alt: "Shopee Delivery Image 3"
    }
  ];
  
  const totalSlides = slides.length;
  const carouselInnerRef = useRef<HTMLDivElement>(null);
  
  const showSlide = (index: number) => {
    let newIndex = index;
    if (index >= totalSlides) {
      newIndex = 0;
    } else if (index < 0) {
      newIndex = totalSlides - 1;
    }
    
    setCurrentSlide(newIndex);
    if (carouselInnerRef.current) {
      carouselInnerRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }
  };
  
  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    showSlide(currentSlide - 1);
  };
  
  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    showSlide(currentSlide + 1);
  };
  
  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);
  
  return (
    <section className="carousel">
      <div className="carousel-inner" ref={carouselInnerRef}>
        {slides.map((slide, index) => (
          <div className="carousel-item" key={index}>
            <img src={slide.url} alt={slide.alt} className="w-full" />
          </div>
        ))}
      </div>
      <a className="carousel-control carousel-control-prev" href="#" role="button" onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </a>
      <a className="carousel-control carousel-control-next" href="#" role="button" onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </a>
    </section>
  );
};

export default Carousel;
