# Implementation Plan

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Hero Layering, Parallax, Timeline, and Production Polish Bugs
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - **Exploration Test Details**:
    - Test Hero z-index: Verify mountains at z-20 and text at z-10 (bug exists when text appears in front of mountains)
    - Test parallax engine: Verify GSAP ScrollTrigger is used instead of Framer Motion's useScroll/useTransform
    - Test timeline reveal: Verify all three cities (Osaka, Kyoto, Tokyo) appear simultaneously without sequential delays
    - Test production polish: Verify Lenis uses `smoothWheel: true` instead of `smooth: true`, cursor uses 40px instead of 32px
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Unchanged Behaviors During Bugfix
  - **IMPORTANT**: Follow observation-first methodology
  - **Observe behavior on UNFIXED code** for non-buggy inputs:
    - Hero section three-layer z-index structure (mountains z-20, text z-10, figure z-30)
    - About section vertical hairline, node dots, and date labels display
    - Custom cursor hiding on mobile (window.innerWidth < 768)
    - System cursor remains hidden on desktop (cursor: none on body)
    - Custom cursor tracks mouse movement with GSAP smoothing
    - Navigation, social icons, cherry blossom branches, polaroid card strip, and "Book Now" button display at current positions
  - Write property-based tests capturing observed behavior patterns:
    - Test that hero three-layer structure is maintained (even with incorrect z-index values currently)
    - Test that timeline elements (hairline, dots, labels) remain visible
    - Test that cursor hiding logic works on mobile devices
    - Test that navigation elements remain at z-index 40
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Fix for Hero layering, parallax migration, timeline reveals, and production polish

  - [ ] 3.1 Implement z-index fix for Hero layering
    - Swap mountains z-index from z-20 to z-30
    - Swap text z-index from z-10 to z-20
    - Swap figure z-index from z-30 to z-40
    - Ensure mountains render after text in JSX (mountains has higher z-index but renders after text)
    - _Bug_Condition: currentHeroZIndex.mountains == 20 AND currentHeroZIndex.text == 10_
    - _Expected_Behavior: mountains at z-30 appear in front of text at z-20, CSS mask reveals only upper 15% of JAPAN text_
    - _Preservation: Hero three-layer z-index structure maintained (mountains z-30, text z-20, figure z-40)_
    - _Requirements: 2.1, 3.1_

  - [ ] 3.2 Migrate Hero parallax from GSAP to Framer Motion
    - Import Framer Motion hooks: `useScroll`, `useTransform`
    - Import `motion` component for GPU-accelerated wrappers
    - Replace GSAP ScrollTrigger animations with Framer Motion's `useScroll` and `useTransform`
    - Create scroll progress with `useScroll` using target heroRef and offset ['start start', 'end start']
    - Implement GPU-accelerated transforms:
      - Mountains: y from 0 to -30 (0.3x speed)
      - Text: y from 0 to -50 (0.5x speed)
      - Figure: y from 0 to -10 (0.15x speed)
      - Cards: x from 0 to -120 (0.4x speed)
    - Wrap animated elements in `motion.div` with `willChange: "transform"`
    - _Bug_Condition: parallaxEngine == 'gsap' AND usesNonGPUTransforms_
    - _Expected_Behavior: scroll animations use Framer Motion's useScroll/useTransform with GPU-accelerated transforms via motion.div_
    - _Preservation: All existing interactive elements and animations remain functional_
    - _Requirements: 2.2, 3.2, 3.3, 3.4_

  - [ ] 3.3 Implement viewport-triggered sequential reveal for About timeline
    - Import `useRef` and `useEffect` from React
    - Import `useInView` from Framer Motion for viewport-triggered reveals
    - Create cityRefs array to store references to timeline city elements
    - Implement sequential delay for each city cluster:
      - Osaka: 0ms delay
      - Kyoto: 200ms delay  
      - Tokyo: 400ms delay
    - Animate each city from opacity: 0 and y: 40 to opacity: 1 and y: 0
    - Use cubic-bezier easing for smooth animations
    - _Bug_Condition: timelineReveal.delay == 0 AND cityCount > 1_
    - _Expected_Behavior: cities reveal sequentially with viewport-triggered animations (0ms, 200ms, 400ms delays)_
    - _Preservation: Vertical hairline, node dots, and date labels continue to display_
    - _Requirements: 2.3, 3.2_

  - [ ] 3.4 Configure Lenis smooth scrolling
    - Change `smoothWheel: true` to `smooth: true`
    - Add `smoothTouch: false` for mobile device consistency
    - Keep existing duration (1.2) and easing function
    - _Bug_Condition: lenisConfig.smoothWheel == true OR lenisConfig.smooth != true_
    - _Expected_Behavior: Lenis with `smooth: true` and `smoothTouch: false`_
    - _Preservation: Lenis smooth scrolling continues to integrate with GSAP ScrollTrigger_
    - _Requirements: 2.4, 3.4_

  - [ ] 3.5 Update custom cursor dimensions and mobile detection
    - Change hover circle from `w-[40px]` to `w-[32px]`
    - Keep existing hover state logic with 32px instead of 40px
    - Add mobile detection: `window.innerWidth < 768`
    - Hide custom cursor on mobile devices
    - Keep system cursor hidden on desktop (cursor: none on body)
    - _Bug_Condition: cursorHoverSize == 40px_
    - _Expected_Behavior: custom cursor uses 32px for hover state, hidden on mobile (window.innerWidth < 768)_
    - _Preservation: Custom cursor hiding on mobile and tracking on desktop unchanged_
    - _Requirements: 2.4, 3.3_

  - [ ] 3.6 Add polaroid card hover effects
    - Update polaroid card hover style from `translateY(-6px)` to `translateY(-8px)`
    - Add scale transform: `transform: scale(1.02)` on hover
    - Add sakura pink glow effect to boxShadow on hover
    - Update boxShadow from `0 16px 48px rgba(212, 248, 122, 0.12)` to `0 20px 40px rgba(255, 184, 197, 0.2)`
    - _Bug_Condition: polaroidHoverEffect == none_
    - _Expected_Behavior: cards translateY(-8px), scale to 1.02, and add sakura pink glow (box-shadow: 0 20px 40px rgba(255, 184, 197, 0.2))_
    - _Preservation: All polaroid cards continue to display with current layout_
    - _Requirements: 2.5, 3.5_

  - [ ] 3.7 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Hero Layering, Parallax, Timeline, and Production Polish Fixed
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 3.8 Verify preservation tests still pass
    - **Property 2: Preservation** - Unchanged Behaviors During Bugfix
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Overview

This implementation plan addresses four critical visual and interactive issues in the Japan tour booking site:

1. **Hero layering (z-index bug)**: Fix the layering order so mountains appear in front of JAPAN typography with proper CSS mask reveal
2. **Scroll parallax**: Migrate from GSAP ScrollTrigger to Framer Motion's `useScroll` and `useTransform` hooks for GPU-accelerated animations
3. **Timeline sequential reveal**: Implement viewport-triggered reveals for the About section timeline with Framer Motion's `useInView`
4. **Production polish**: Configure Lenis smooth scrolling, update custom cursor dimensions, and add polaroid card hover effects

## Task Dependency Graph

```json
{
  "tasks": {
    "1": {
      "title": "Bug Condition Exploration Test",
      "dependencies": [],
      "wave": 1
    },
    "2": {
      "title": "Preservation Property Tests",
      "dependencies": [],
      "wave": 1
    },
    "3": {
      "title": "Implementation",
      "dependencies": ["1", "2"],
      "wave": 2,
      "subtasks": {
        "3.1": {
          "title": "Z-Index Fix",
          "dependencies": ["3"],
          "wave": 2
        },
        "3.2": {
          "title": "Parallax Migration",
          "dependencies": ["3"],
          "wave": 2
        },
        "3.3": {
          "title": "Timeline Reveals",
          "dependencies": ["3"],
          "wave": 2
        },
        "3.4": {
          "title": "Lenis Config",
          "dependencies": ["3"],
          "wave": 2
        },
        "3.5": {
          "title": "Custom Cursor",
          "dependencies": ["3"],
          "wave": 2
        },
        "3.6": {
          "title": "Polaroid Hover",
          "dependencies": ["3"],
          "wave": 2
        },
        "3.7": {
          "title": "Verify Bug Fix",
          "dependencies": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"],
          "wave": 3
        },
        "3.8": {
          "title": "Verify Preservation",
          "dependencies": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"],
          "wave": 3
        }
      }
    },
    "4": {
      "title": "Checkpoint",
      "dependencies": ["3.7", "3.8"],
      "wave": 4
    }
  },
  "waves": [
    {
      "wave": 1,
      "tasks": ["1", "2"],
      "description": "Tests written on unfixed code"
    },
    {
      "wave": 2,
      "tasks": ["3"],
      "description": "Implementation tasks"
    },
    {
      "wave": 3,
      "tasks": ["3.7", "3.8"],
      "description": "Verification tasks after implementation"
    },
    {
      "wave": 4,
      "tasks": ["4"],
      "description": "Final checkpoint"
    }
  ]
}
```

## Notes

- **Bug Condition Methodology**: This bugfix uses the bug condition methodology to systematically validate fixes:
  - C(X): Bug Condition - identifies inputs that trigger the bug
  - P(result): Property - desired behavior for buggy inputs
  - ¬C(X): Non-buggy inputs that should be preserved
  - F: Original (unfixed) function
  - F': Fixed function
  - Counterexamples: Concrete examples demonstrating the bug exists

- **Preservation Checking**: The preservation tests capture observed behavior on the current code to ensure no regressions after fixes are implemented.

- **Exploration Tests**: The bug condition exploration tests must FAIL on unfixed code to confirm the bug exists, then PASS after fixes are implemented.

- **Implementation Order**: Follow the dependency graph to ensure tests are in place before implementation, and verification tests run after fixes.

- **Specification References**: Each task includes "_Requirements: X.Y_" annotations referencing the bugfix requirements document for traceability.