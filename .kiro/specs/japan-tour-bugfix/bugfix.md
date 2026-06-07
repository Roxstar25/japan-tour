# Bugfix Requirements Document

## Introduction

This bugfix addresses four critical visual and interactive issues in the Japan tour booking site hero section and about timeline. The site uses an "editorial cinematic" aesthetic inspired by Wes Anderson and Studio Ghibli. The bugs affect z-index layering, scroll-driven parallax animations, timeline reveals, and production polish including Lenis smooth scrolling, custom cursor behavior, and card hover states.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the hero section renders THEN the "JAPAN" typography appears in front of (z-index higher than) the mountain landscape image, causing the CSS mask on the mountains to not reveal the text as intended

1.2 WHEN the user scrolls the hero section THEN the parallax effect uses GSAP ScrollTrigger with scrub: true, but mountains move at 0.3x speed, text at 0.5x speed, cards at 0.4x speed without GPU-accelerated transforms

1.3 WHEN the About section timeline renders THEN all three city clusters (Osaka, Kyoto, Tokyo) appear simultaneously at full opacity without viewport-triggered sequential reveal

1.4 WHEN the Lenis smooth scrolling instance is created THEN it uses `smoothWheel: true` instead of `smooth: true`, and the custom cursor hover state uses 40px instead of 32px for the outlined circle

1.5 WHEN the polaroid card strip renders THEN the cards lack hover animations that would provide visual feedback and warm glow effect

### Expected Behavior (Correct)

2.1 WHEN the hero section renders THEN the mountain image (z-20) appears in front of the "JAPAN" typography (z-10) and the CSS mask `linear-gradient(to bottom, transparent 0%, black 15%, black 100%)` on the mountains properly reveals only the upper 15% of the JAPAN letters

2.2 WHEN the user scrolls the hero section THEN the parallax effect uses Framer Motion's useScroll and useTransform hooks with linear easing for GPU-accelerated transforms via motion.div wrappers with willChange: "transform"

2.3 WHEN the About section timeline renders THEN city clusters appear sequentially with viewport-triggered reveal: Osaka (0ms delay), Kyoto (200ms delay), Tokyo (400ms delay), each animating from opacity: 0 and y: 40 to opacity: 1 and y: 0 with cubic-bezier easing

2.4 WHEN the Lenis smooth scrolling instance is created THEN it uses `smooth: true` and `smoothTouch: false`, the custom cursor uses 32px (w-[32px]) for hover state, and the custom cursor is hidden on mobile (window.innerWidth < 768)

2.5 WHEN the user hovers over polaroid cards THEN the cards translateY(-8px), scale to 1.02, and add a sakura pink glow (box-shadow: 0 20px 40px rgba(255, 184, 197, 0.2))

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the hero section renders THEN the three-layer z-index structure (mountains at z-20, text at z-10, figure at z-30) is maintained and all three layers remain absolutely positioned

3.2 WHEN the About section timeline renders THEN the vertical hairline, node dots, and date labels continue to display for each city cluster

3.3 WHEN any interactive elements are hovered THEN the system cursor remains hidden on desktop (cursor: none on body) and the custom cursor continues to track mouse movement with GSAP smoothing

3.4 WHEN the user scrolls the page THEN the Lenis smooth scrolling continues to integrate with GSAP ScrollTrigger and Framer Motion animations remain functional

3.5 WHEN the hero section renders THEN the navigation, social icons, cherry blossom branches, polaroid card strip, and floating "Book Now" button continue to display at their current positions with z-index 40
