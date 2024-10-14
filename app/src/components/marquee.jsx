import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Marquee.module.css";

export const EPMarquee = ({
  direction = "up",
  speed: _speed = 7,
  children,
}) => {
  const speed = _speed * children.length;

  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    let startY = direction === "up" ? 0 : -marquee.scrollHeight;
    let endY = direction === "up" ? -marquee.scrollHeight : 0;

    const animateMarquee = () => {
      marquee.style.transition = `transform ${speed}s linear`;
      marquee.style.transform = `translateY(${endY}px)`;
    };

    const handleTransitionEnd = () => {
      marquee.style.transition = "none";
      marquee.style.transform = `translateY(${startY}px)`;
      setTimeout(animateMarquee, 100); // Slight delay to make the loop seamless
    };

    marquee.addEventListener("transitionend", handleTransitionEnd);
    animateMarquee();

    return () => {
      marquee.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [direction, speed]);

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent} ref={marqueeRef}>
        {new Array(10).fill(0).map((_, i) => children)}
      </div>
    </div>
  );
};
