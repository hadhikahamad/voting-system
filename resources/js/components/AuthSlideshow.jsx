import React, { useState, useEffect } from 'react';
import registerImage from '../images/Register.png';

const slides = [
    {
        id: 1,
        image: registerImage,
        title: "Secure Voting",
        subtitle: "Experience the future of democracy with our blockchain-backed security.",
        position: "center center",
        transformOrigin: "center center",
        scale: "1.1"
    },
    {
        id: 2,
        image: registerImage,
        title: "Real-time Results",
        subtitle: "Watch elections unfold with instant, transparent vote counting.",
        position: "left top",
        transformOrigin: "top left",
        scale: "1.2"
    },
    {
        id: 3,
        image: registerImage,
        title: "Empower Your Voice",
        subtitle: "Participate in elections from anywhere, anytime, securely.",
        position: "right bottom",
        transformOrigin: "bottom right",
        scale: "1.15"
    }
];

export default function AuthSlideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="vs-auth-slideshow" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderTopRightRadius: '30px', borderBottomRightRadius: '30px' }}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        zIndex: index === currentIndex ? 1 : 0,
                    }}
                >
                    {/* Background Image with Dynamic Ken Burns Effect */}
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: slide.position,
                            transformOrigin: slide.transformOrigin,
                            transform: index === currentIndex ? `scale(${slide.scale})` : 'scale(1)',
                            transition: 'transform 6s ease-out',
                        }}
                    ></div>

                    {/* Gradient Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.1) 100%)',
                    }}></div>

                    {/* Text Content */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        right: '40px',
                        color: '#fff',
                        transform: index === currentIndex ? 'translateY(0)' : 'translateY(20px)',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'all 0.8s ease-out 0.3s',
                    }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '10px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            {slide.title}
                        </h3>
                        <p style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.85)',
                            lineHeight: '1.5',
                            maxWidth: '80%'
                        }}>
                            {slide.subtitle}
                        </p>
                    </div>
                </div>
            ))}

            {/* Slide Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '40px',
                display: 'flex',
                gap: '8px',
                zIndex: 10
            }}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: index === currentIndex ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: index === currentIndex ? '#30d5c8' : 'rgba(255,255,255,0.3)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
