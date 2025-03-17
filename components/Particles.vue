<template>
  <NuxtParticles
    class="-z-10"
    id="tsparticles"
    :options="options"
    @load="onLoad"
  ></NuxtParticles>
</template>

<script setup lang="ts">
import type { Container } from "@tsparticles/engine";

const options = {
  background: {
    color: {
      value: "#F2F2F2", // Tertiary: Light gray (almost white) background
    },
    image: "linear-gradient(to bottom right, #FFFFFF, #0071BC 99%)", // Gradient from white to blue, smaller and positioned to bottom right
  },
  particles: {
    color: {
      value: ["#00579d", "#0071BC", "#2793db", "#2483c2", "#2678af", "#c7e9ff"], // Primary and Secondary blue colors
    },
    links: {
      enable: true, // Enable links for the network effect
      color: ["#2678af"], // Primary: Deep blue for connecting lines
      distance: 150,
      opacity: 1,
      width: 3, // Increased line width to ensure visibility
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      outMode: "bounce",
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
    number: {
      value: 120, // Increased number of particles
      density: {
        enable: true,
        value_area: 800,
      },
    },
    opacity: {
      value: 0.3, // Further reduced opacity for a more blurred effect
      random: true,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false,
      },
    },
    size: {
      value: 7,
      random: true,
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 1,
        sync: false,
      },
    },
    filter: {
      blur: 10, // Increase blur effect
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
};

const onLoad = (container: Container) => {
  // Remove the pause and setTimeout to start particles immediately
  container.play();
};
</script>
