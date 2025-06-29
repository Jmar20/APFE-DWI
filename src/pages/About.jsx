import React from "react";
import { Box } from "@mui/material";
import AboutHero from "../components/AboutHero";
import ContentBlocks from "../components/ContentBlocks";
import AboutFeatures from "../components/AboutFeatures";
import TeamSection from "../components/TeamSection";

const About = () => {
  return (
    <Box>
      {/* Hero Section */}
      <AboutHero />

      {/* Bloques de contenido - Misión y Visión */}
      <ContentBlocks />

      {/* Sección de características/valores */}
      <AboutFeatures />

      {/* Sección del equipo */}
      <TeamSection />
    </Box>
  );
};

export default About;
