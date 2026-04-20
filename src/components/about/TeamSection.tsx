"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Team1 from "../../../public/about/Team1.jpg";
import Team2 from "../../../public/about/Team2.png";

const team = [
  {
    name: "Anuj Tiwari",
    bio: "Lorem ipsum dolor sit amet, consectetur do eiusmod tempor incididunt ut labore et dolore aliqua. Ut enim ad minim veniam, quis nostrud ullamco laboris nisi ut aliquip.",
    img: Team2,
  },
  {
    name: "Priya Sharma",
    bio: "Operations & sourcing. Working with trusted local partners to bring you the finest quality every single time.",
    img: Team1,
  },
  {
    name: "Rohan Mehta",
    bio: "Customer experience. Always here to help you find exactly the right product for your needs.",
    img: Team1,
  },
];

const TRANSITION = "all 0.42s cubic-bezier(0.4,0,0.2,1)";

export default function TeamSection() {
  const [idx, setIdx] = useState(0);
  const [bioKey, setBioKey] = useState(0);
  const busy = useRef(false);
  const imgLRef = useRef<HTMLImageElement>(null);
  const imgCRef = useRef<HTMLImageElement>(null);
  const imgRRef = useRef<HTMLImageElement>(null);

  const get = (offset: number) =>
    team[(idx + offset + team.length) % team.length];

  const navigate = (dir: "next" | "prev") => {
    if (busy.current) return;
    busy.current = true;
    const iL = imgLRef.current!;
    const iC = imgCRef.current!;
    const iR = imgRRef.current!;

    iC.style.transition = TRANSITION;
    iC.style.transform = `rotate(${dir === "next" ? -20 : 10}deg) translateX(${dir === "next" ? -240 : 240}px)`;
    iC.style.opacity = "0";

    if (dir === "next") {
      iR.style.transition = TRANSITION;
      iR.style.transform = "rotate(0deg) translateX(-200px)";
      iR.style.opacity = "1";
    } else {
      iL.style.transition = TRANSITION;
      iL.style.transform = "rotate(0deg) translateX(200px)";
      iL.style.opacity = "1";
    }

    setTimeout(() => {
      const newIdx =
        dir === "next"
          ? (idx + 1) % team.length
          : (idx - 1 + team.length) % team.length;

      iC.style.transition = "none";
      iC.style.transform = `rotate(-5deg) translateX(${dir === "next" ? 260 : -260}px)`;
      iC.style.opacity = "0";
      iL.style.transition = "none";
      iL.style.transform = "rotate(12deg) translateX(0)";
      iL.style.opacity = "1";
      iR.style.transition = "none";
      iR.style.transform = "rotate(-12deg) translateX(0)";
      iR.style.opacity = "1";

      setIdx(newIdx);
      setBioKey((k) => k + 1);

      requestAnimationFrame(() => {
        iC.style.transition = TRANSITION;
        iC.style.transform = "rotate(-5deg) translateX(0)";
        iC.style.opacity = "1";
      });

      setTimeout(() => {
        busy.current = false;
      }, 460);
    }, 430);
  };

  return (
    <section className="team-section">
      <h2 className="team-title">Meet the Team</h2>

      {/*
        position: relative here is critical — it anchors .team-bio
        which is position: absolute inside this wrapper.
      */}
      <div className="team-layout" style={{ position: "relative" }}>

        {/* ── Cards stage ── */}
        <div className="team-stage">

          {/* Oval ring */}
          <div className="team-oval" />

          {/* Hanging arc */}
          <svg
            className="team-arc"
            viewBox="0 0 680 580"
            preserveAspectRatio="none"
          >
            <path
              d="M -20 250 Q 340 430 700 250"
              fill="none"
              stroke="#d4d4d8"
              strokeWidth="1"
            />
          </svg>

          {/* Left card */}
          <div className="card-slot card-slot--left">
            <Image
              ref={imgLRef}
              src={get(-1).img}
              alt={get(-1).name}
              width={95}
              height={160}
              className="card-img card-img--side card-img--left"
            />
          </div>

          {/* Center card */}
          <div className="card-slot card-slot--center">
            <Image
              ref={imgCRef}
              src={get(0).img}
              alt={get(0).name}
              width={250}
              height={360}
              className="card-img card-img--center"
            />
          </div>

          {/* Right card */}
          <div className="card-slot card-slot--right">
            <Image
              ref={imgRRef}
              src={get(1).img}
              alt={get(1).name}
              width={95}
              height={160}
              className="card-img card-img--side card-img--right"
            />
          </div>

          {/* Nav */}
          <div className="team-nav">
            <button
              className="team-nav__btn"
              onClick={() => navigate("prev")}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              className="team-nav__btn"
              onClick={() => navigate("next")}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        {/* ── Bio — anchored to .team-layout via position: absolute ── */}
        <div key={bioKey} className="team-bio bio-fade">
          <h3 className="team-bio__name">{get(0).name}</h3>
          <p className="team-bio__text">{get(0).bio}</p>
        </div>
      </div>
    </section>
  );
}