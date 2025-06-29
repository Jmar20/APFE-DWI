import React from "react";
import { Box } from "@mui/material";
import HeroSection from "../components/HeroSection";
import InfoCards from "../components/InfoCards";
import Testimonials from "../components/Testimonials";
import VideoSection from "../components/VideoSection";

const HomePage = () => {
  return (
    <Box>
      {/* Sección principal tipo hero */}
      <HeroSection />

      {/* Tres tarjetas informativas */}
      <InfoCards />

      {/* Sección de testimonios */}
      <Testimonials />

      {/* Sección informativa con video */}
      <VideoSection />
    </Box>
  );
};

export default HomePage;
