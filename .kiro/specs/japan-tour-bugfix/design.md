# Japan Tour Bugfix Design

## Overview

This design document specifies the technical implementation for fixing four critical visual and interactive issues in the Japan tour booking site:

1. **Hero layering (z-index bug)**: Fix the layering order so mountains appear in front of JAPAN typography with proper CSS mask reveal
2. **Scroll parallax**: Migrate from GSAP ScrollTrigger to Framer Motion's `useScroll` and `useTransform` hooks for GPU-accelerated animations
3. **Timeline sequential reveal**: Implement viewport-triggered reveals for the About section timeline with Framer Motion's `useInView`
4. **Production polish**: Configure Lenis smooth scrolling, update custom cursor dimensions, and add polaroid card hover effects

The fix uses a hybrid approach: migrating hero section animations to Framer Motion while maintaining integration with existing GSAP ScrollTrigger instances elsewhere in the application.

## Glossary

- **Bug_Condition (C)**: The condition that triggers visual defects:
  - C1: Hero z-index places typography (z-10) in front of mountains (z-20), causing CSS mask to incorrectly reveal text
  - C2: Scroll parallax uses CSS transforms without GPU acceleration or uses GSAP instead of Framer Motion
  - C3: Timeline cities appear simultaneously without viewport-triggered sequential reveal
  - C4: Lenis uses `smoothWheel: true` instead of `smooth: true`, custom cursor uses 40px instead of 32px, polaroid cards lack hover effects

- **Property (P)**: The desired correct behavior:
  - P1: Mountains appear in front of typography, CSS mask reveals only upper 15% of JAPAN text
  - P2: Scroll animations use GPU-accelerated transforms via Framer Motion hooks
  - P3: Timeline cities reveal sequentially with viewport-triggered animations (0ms, 200ms, 400ms delays)
  - P4: Lenis smooth scrolling configured correctly, custom cursor dimensions updated, polaroid hover effects added

- **Preservation**: Existing functionality that must remain unchanged:
  - Hero three-layer z-index structure (mountains z-20, text z-10, figure z-30)
  - About section vertical hairline, node dots, and date labels
  - Custom cursor hiding on mobile (window.innerWidth < 768)
  - All existing interactive elements and navigation functionality

- **lenisRef**: React ref storing the Lenis smooth scrolling instance for integration with ScrollTrigger
- **heroRef, mountainsRef, textRef, figureRef, cardsRef**: React refs for DOM elements in Hero section requiring parallax animation
- **cityRefs**: Array of React refs for timeline city elements in About section

## Bug Details

### Bug Condition

The bug manifests in four ways:

1. **Hero z-index bug**: The "JAPAN" typography is rendered with z-10 while the mountain image uses z-20, but the CSS mask on mountains (`linear-gradient(to bottom, transparent 0%, black 15%, black 100%)`) incorrectly reveals the text because the layer order is backwards.

2. **Parallax implementation bug**: The current GSAP ScrollTrigger animations use non-GPU-accelerated transforms and lack the smooth, performant hardware-accelerated animations possible with Framer Motion.

3. **Timeline reveal bug**: All three city clusters (Osaka, Kyoto, Tokyo) appear simultaneously at full opacity without viewport-triggered sequential reveal.

4. **Production polish bug**: 
   - Lenis configured with `smoothWheel: true` instead of `smooth: true`
   - Custom cursor uses 40px for hover state instead of 32px
   - Polaroid cards lack hover animations providing visual feedback and warm glow effect

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type void (site state checks)
  OUTPUT: boolean
  
  RETURN 
    (currentHeroZIndex.mountains == 20 AND currentHeroZIndex.text == 10)  // Bug 1
    OR (parallaxEngine == 'gsap' AND usesNonGPUTransforms)  // Bug 2
    OR (timelineReveal.delay == 0 AND cityCount > 1)  // Bug 3
    OR (
      (lenisConfig.smoothWheel == true OR lenisConfig.smooth != true)
      OR (cursorHoverSize == 40px)
      OR (polaroidHoverEffect == none)
    )  // Bug 4
END FUNCTION
```

### Examples

1. **Z-index Bug Example**:
   - **Expected**: Mountains at z-20 appear in front of JAPAN text at z-10, CSS mask reveals only upper 15% of text
   - **Actual**: JAPAN text at z-10 appears in front of mountains, CSS mask incorrectly reveals full text

2. **Parallax Bug Example**:
   - **Expected**: Mountains move at 0.3x speed, text at 0.5x speed, cards at 0.4x speed with GPU-accelerated transforms via Framer Motion's `useTransform`
   - **Actual**: Same animations but using GSAP ScrollTrigger without GPU acceleration

3. **Timeline Bug Example**:
   - **Expected**: Osaka city cluster (0ms delay), Kyoto (200ms delay), Tokyo (400ms delay) reveal sequentially from opacity: 0, y: 40 to opacity: 1, y: 0
   - **Actual**: All three city clusters appear simultaneously at full opacity

4. **Production Polish Bug Example**:
   - **Expected**: Lenis with `smooth: true`, `smoothTouch: false`, custom cursor 32px on hover, polaroid hover translateY(-8px) with sakura pink glow
   - **Actual**: Lenis with `smoothWheel: true`, custom cursor 40px on hover, no polaroid hover effects

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Hero section three-layer z-index structure maintained (mountains z-20, text z-10, figure z-30)
- All three layers remain absolutely positioned with proper positioning
- About section vertical hairline, node dots, and date labels continue to display
- Custom cursor hidden on mobile devices (window.innerWidth < 768)
- System cursor remains hidden on desktop (cursor: none on body)
- Navigation, social icons, cherry blossom branches, polaroid card strip, and floating "Book Now" button display at current positions with z-index 40
- Lenis smooth scrolling continues to integrate with GSAP ScrollTrigger
- Framer Motion animations remain functional alongside existing GSAP animations

**Scope:**
All inputs that do NOT involve the four specific bug conditions should be completely unaffected by this fix. This includes:
- Mouse clicks on interactive elements
- Mobile touch interactions
- Other keyboard inputs (arrows, Enter, Escape, etc.)
- All existing animations except the four specific bug fixes
- Responsive layout behavior across all breakpoints

## Hypothesized Root Cause

Based on the bug description, the most likely issues are:

1. **Incorrect Z-index Values**:
   - JAPAN typography uses z-10 but should be behind mountains at z-20
   - Mountains at z-20 should be in front but layer order is incorrect in the render tree
   - CSS mask requires mountains to be in front of text to work correctly

2. **Animation Engine Migration**:
   - Hero section animations use GSAP ScrollTrigger with non-GPU-accelerated transforms
   - Framer Motion's `useScroll` and `useTransform` provide hardware-accelerated animations
   - Need to replace `gsap.to` calls with Framer Motion's `motion.div` wrappers

3. **Timeline Sequential Reveal Missing**:
   - City refs in About section use a shared ref array but no sequential delay implementation
   - Current GSAP animation applies same duration and delay to all cities
   - Need viewport-triggered reveals with staggered delays (0ms, 200ms, 400ms)

4. **Production Polish Configuration Issues**:
   - Lenis configured with `smoothWheel: true` instead of `smooth: true` for cross-browser smooth scrolling
   - Custom cursor hover state uses `w-[40px]` (40px) instead of `w-[32px]` (32px)
   - Polaroid cards lack hover state management for translateY and glow effects

## Correctness Properties

Property 1: Bug Condition - Hero Z-Index and Mask Reveal

_For any_ hero section render, the mountain image (z-20) SHALL appear in front of the JAPAN typography (z-10), and the CSS mask `linear-gradient(to bottom, transparent 0%, black 15%, black 100%)` on the mountains SHALL reveal only the upper 15% of the JAPAN letters, not the full text.

**Validates: Requirements 2.1**

Property 2: Bug Condition - GPU-Accelerated Parallax

_For any_ scroll interaction in the hero section, the parallax effect SHALL use Framer Motion's useScroll and useTransform hooks with linear easing, providing GPU-accelerated transforms via motion.div wrappers with willChange: "transform", instead of GSAP ScrollTrigger.

**Validates: Requirements 2.2**

Property 3: Bug Condition - Sequential Timeline Reveal

_For any_ timeline city cluster render, cities SHALL appear sequentially with viewport-triggered reveal: Osaka (0ms delay), Kyoto (200ms delay), Tokyo (400ms delay), each animating from opacity: 0 and y: 40 to opacity: 1 and y: 0 with cubic-bezier easing.

**Validates: Requirements 2.3**

Property 4: Bug Condition - Production Polish Configuration

_For any_ page load on devices with window.innerWidth >= 768, the Lenis instance SHALL use `smooth: true` and `smoothTouch: false`, the custom cursor SHALL use 32px for hover state, and polaroid cards SHALL have hover animations with translateY(-8px), scale 1.02, and sakura pink glow (box-shadow: 0 20px 40px rgba(255, 184, 197, 0.2)).

**Validates: Requirements 2.4, 2.5**

Property 5: Preservation - Unchanged Z-Index Structure

_For any_ hero section render, the three-layer z-index structure (mountains at z-20, text at z-10, figure at z-30) SHALL be maintained and all three layers SHALL remain absolutely positioned, preserving the current visual hierarchy.

**Validates: Requirements 3.1**

Property 6: Preservation - Timeline Elements

_For any_ About section render, the vertical hairline, node dots, and date labels SHALL continue to display for each city cluster, preserving the timeline visual structure.

**Validates: Requirements 3.2**

Property 7: Preservation - Cursor Behavior

_For any_ interactive element hover, the system cursor SHALL remain hidden on desktop (cursor: none on body), and the custom cursor SHALL continue to track mouse movement with GSAP smoothing on non-mobile devices.

**Validates: Requirements 3.3**

Property 8: Preservation - Scroll Integration

_For any_ page scroll interaction, the Lenis smooth scrolling SHALL continue to integrate with GSAP ScrollTrigger, and Framer Motion animations SHALL remain functional.

**Validates: Requirements 3.4**

Property 9: Preservation - Navigation Elements

_For any_ hero section render, the navigation, social icons, cherry blossom branches, polaroid card strip, and floating "Book Now" button SHALL continue to display at their current positions with z-index 40, preserving the current UI layout.

**Validates: Requirements 3.5**

## Fix Implementation

### Changes Required

**Assumption**: We will migrate the Hero section to Framer Motion while keeping About section animations in GSAP for consistency with the rest of the application.

### 1. Z-Index Fix

**File**: `app/src/sections/Hero.tsx`

**Specific Changes**:
1. **Swap z-index values**: Change mountains from z-20 to z-30, change text from z-10 to z-20, change figure from z-30 to z-40
2. **Adjust render order**: Ensure mountains render after text in JSX (mountains has higher z-index but renders after text)

**Implementation**:
```typescript
// BEFORE: mountains z-20, text z-10, figure z-30
// AFTER: text z-20, mountains z-30, figure z-40

// JAPAN Typography (behind mountains) - now z-20
<div
  ref={textRef}
  className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-center pointer-events-none select-none"
  style={{ height: '75%' }}
>

// Mountain Image (in front of text) - now z-30
<div
  ref={mountainsRef}
  className="absolute inset-x-0 bottom-0 z-30 w-full"
  style={{ height: '70%' }}
>

// Kimono Figure (foreground) - now z-40
<div
  ref={figureRef}
  className="absolute z-40 pointer-events-none"
  style={{
    right: '2%',
    bottom: '8%',
    width: 'clamp(200px, 28vw, 420px)',
    height: 'clamp(320px, 42vw, 600px)',
  }}
>
```

### 2. Parallax Migration to Framer Motion

**File**: `app/src/sections/Hero.tsx`

**Specific Changes**:
1. Import Framer Motion hooks: `useScroll`, `useTransform`
2. Import `motion` component for GPU-accelerated wrappers
3. Replace GSAP animations with Framer Motion's `useScroll` and `useTransform`
4. Use `motion.div` wrappers with `willChange: "transform"` for GPU acceleration

**Implementation**:
```typescript
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const mountainsRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // GPU-accelerated parallax transforms using useTransform
  const mountainsY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const figureY = useTransform(scrollYProgress, [0, 1], [0, -10])
  const cardsX = useTransform(scrollYProgress, [0, 1], [0, -120])

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden"
    >
      {/* JAPAN Typography with GPU acceleration */}
      <motion.div
        ref={textRef}
        className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-center pointer-events-none select-none"
        style={{ 
          height: '75%',
          willChange: 'transform',
          y: textY,
        }}
      >
        <h1 className="font-display text-[clamp(120px,22vw,400px)] ...">
          JAPAN
        </h1>
      </motion.div>

      {/* Mountain Image with GPU acceleration */}
      <motion.div
        ref={mountainsRef}
        className="absolute inset-x-0 bottom-0 z-30 w-full"
        style={{ 
          height: '70%',
          willChange: 'transform',
          y: mountainsY,
        }}
      >
        <img
          src="/images/hero-mountains.jpg"
          alt="Misty Japanese mountains at dawn"
          className="w-full h-full object-cover object-bottom"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
          }}
        />
      </motion.div>

      {/* Kimono Figure with GPU acceleration */}
      <motion.div
        ref={figureRef}
        className="absolute z-40 pointer-events-none"
        style={{
          right: '2%',
          bottom: '8%',
          width: 'clamp(200px, 28vw, 420px)',
          height: 'clamp(320px, 42vw, 600px)',
          willChange: 'transform',
          y: figureY,
        }}
      >
        <img
          src="/images/kimono-figure.png"
          alt="Woman in floral kimono gazing at mountains"
          className="w-full h-full object-contain object-bottom"
        />
      </motion.div>

      {/* Cards with GPU acceleration */}
      <motion.div
        ref={cardsRef}
        className="absolute bottom-8 left-6 md:left-10 lg:left-16 z-50"
        style={{
          willChange: 'transform',
          x: cardsX,
        }}
      >
        <div className="flex gap-4">
          {polaroidData.map((item, i) => (
            <PolaroidCard key={i} {...item} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
```

### 3. Timeline Sequential Reveal with Framer Motion

**File**: `app/src/sections/About.tsx`

**Specific Changes**:
1. Import `useRef` and `useEffect` from React
2. Import `useInView` from Framer Motion for viewport-triggered reveals
3. Implement sequential delay for each city cluster
4. Use `motion.div` for city elements with viewport-triggered animations

**Implementation**:
```typescript
import { motion, useInView } from 'framer-motion'

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const cityRefs = useRef<(HTMLDivElement | null)[]>([])

  // Use useEffect for viewport-triggered reveals with Framer Motion
  useEffect(() => {
    cityRefs.current.forEach((city, i) => {
      if (!city) return
      
      const viewRef = useRef<HTMLDivElement>(null)
      const isInView = useInView(viewRef, { once: true, margin: '-20%' })
      
      // City clusters appear sequentially with viewport-triggered reveal
      // Osaka (0ms delay), Kyoto (200ms delay), Tokyo (400ms delay)
      const transitionDelay = i * 0.2
      
      return (
        <motion.div
          key={city.name}
          ref={viewRef}
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{
            duration: 0.8,
            delay: transitionDelay,
            ease: 'easeOut',
          }}
        >
          {/* Node dot */}
          <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-[#D4F87A]" />
          
          <div className="space-y-3">
            <span className="text-small-caps text-[#888888] block">{city.days}</span>
            <h3 className="font-display text-[clamp(32px,5vw,56px)] text-[#FAFAFA] leading-none">
              {city.name}
            </h3>
            <div className="pt-4">
              <PhotoCluster photos={city.photos} rotation={city.rotation} />
            </div>
          </div>
        </motion.div>
      )
    })
  }, [])
  
  // ... rest of component
}
```

### 4. Production Polish Configuration

#### 4a. Lenis Smooth Scrolling

**File**: `app/src/App.tsx`

**Specific Changes**:
1. Change `smoothWheel: true` to `smooth: true`
2. Add `smoothTouch: false` for mobile device consistency

**Implementation**:
```typescript
// BEFORE
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

// AFTER
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
})
```

#### 4b. Custom Cursor Dimensions

**File**: `app/src/components/CustomCursor.tsx`

**Specific Changes**:
1. Change hover circle from `w-[40px]` to `w-[32px]`
2. Keep existing hover state logic with 32px instead of 40px

**Implementation**:
```typescript
// BEFORE
<div
  ref={circleRef}
  className="fixed top-0 left-0 w-10 h-10 border border-[#FAFAFA]/50 rounded-full pointer-events-none z-[9998] opacity-50 hidden lg:block"
  style={{ transform: 'translate(-100px, -100px)' }}
/>

// AFTER
<div
  ref={circleRef}
  className="fixed top-0 left-0 w-[32px] h-[32px] border border-[#FAFAFA]/50 rounded-full pointer-events-none z-[9998] opacity-50 hidden lg:block"
  style={{ transform: 'translate(-100px, -100px)' }}
/>
```

#### 4c. Polaroid Card Hover Effects

**File**: `app/src/sections/Hero.tsx`

**Specific Changes**:
1. Update polaroid card hover style from `translateY(-6px)` to `translateY(-8px)`
2. Add scale transform: `transform: scale(1.02)` on hover
3. Add sakura pink glow effect to boxShadow on hover
4. Update boxShadow from `0 16px 48px rgba(212, 248, 122, 0.12)` to `0 20px 40px rgba(255, 184, 197, 0.2)`

**Implementation**:
```typescript
function PolaroidCard({ img, video, caption }: { img: string; video: string; caption: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // ... existing useEffect code

  return (
    <div
      className="relative flex-shrink-0 w-[160px] h-[200px] bg-[#1a1a1a] rounded-[4px] p-[6px] pb-[28px] cursor-pointer transition-all duration-300"
      style={{
        transform: isHovered 
          ? 'translateY(-8px) scale(1.02)'  // Changed from translateY(-6px)
          : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(255, 184, 197, 0.2)'  // Changed to sakura pink glow
          : '0 8px 32px rgba(0,0,0,0.4)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ... rest of component */}
    </div>
  )
}
```

#### 4d. Custom Cursor Mobile Detection

**File**: `app/src/components/CustomCursor.tsx`

**Specific Changes**:
1. Add mobile detection: `window.innerWidth < 768`
2. Hide custom cursor on mobile devices

**Implementation**:
```typescript
useEffect(() => {
  // Check if mobile device
  const isMobile = window.innerWidth < 768
  if (isMobile) return
  
  const dot = dotRef.current
  const circle = circleRef.current
  if (!dot || !circle) return
  
  // ... rest of existing cursor code
}, [])
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, verify the bug exists on the current code, then implement fixes and verify they resolve the issues.

### Exploratory Bug Condition Checking

**Goal**: Confirm the bug conditions exist before implementing fixes.

**Test Plan**: 
1. Inspect hero section DOM and verify current z-index values (mountains z-20, text z-10)
2. Check browser devtools to confirm CSS mask is not revealing text correctly
3. Verify GSAP animations are used instead of Framer Motion
4. Check About section timeline cities appear simultaneously
5. Verify Lenis configuration and custom cursor dimensions

**Test Cases**:
1. **Z-Index Test**: Inspect hero section in devtools, verify mountains are behind text (current bug)
2. **Parallax Test**: Scroll hero section, verify animations use GSAP (current bug)
3. **Timeline Test**: View About section, verify all three cities appear at once (current bug)
4. **Production Polish Test**: Check console for Lenis config, verify cursor dimensions (current bug)

**Expected Counterexamples**:
- Mountains z-index is 20, text z-index is 10, confirming bug condition
- GSAP ScrollTrigger detected in hero section parallax
- All timeline cities animate with same delay (0ms)
- Lenis uses `smoothWheel: true`, cursor uses 40px

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode**:
```
// Bug 1: Z-Index Fix Checking
FOR ALL hero section renders DO
  result := getZIndex('mountains')
  ASSERT result == 30
  result := getZIndex('text')
  ASSERT result == 20
END FOR

// Bug 2: Parallax Fix Checking
FOR ALL scroll interactions DO
  result := getAnimationEngine('hero')
  ASSERT result == 'framer-motion'
  result := hasGPUAcceleration('mountains')
  ASSERT result == true
END FOR

// Bug 3: Timeline Fix Checking
FOR ALL timeline city clusters DO
  result := getAnimationDelay(city)
  ASSERT result == [0, 200, 400][index]
END FOR

// Bug 4: Production Polish Checking
FOR ALL page loads on desktop DO
  result := getLenisConfig()
  ASSERT result.smooth == true
  ASSERT result.smoothTouch == false
  result := getCursorHoverSize()
  ASSERT result == 32
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode**:
```
FOR ALL non-buggy inputs DO
  ASSERT heroThreeLayerStructure == true
  ASSERT timelineElementsVisible == true
  ASSERT cursorHidingMobile == true
  ASSERT navigationElements == unchanged
  ASSERT scrollIntegration == functional
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on CURRENT code first for preservation cases, then write tests capturing that behavior.

**Test Cases**:
1. **Z-Index Structure Preservation**: Verify three-layer structure (text z-20, mountains z-30, figure z-40) after fix
2. **Timeline Elements Preservation**: Verify vertical hairline, node dots, and date labels display after fix
3. **Cursor Behavior Preservation**: Verify custom cursor hiding on mobile and tracking on desktop
4. **Navigation Elements Preservation**: Verify navigation, social icons, and polaroid cards display at correct positions

### Unit Tests

- **Z-Index Tests**: Verify hero section layers have correct z-index values (mountains z-30, text z-20, figure z-40)
- **Parallax Tests**: Verify Framer Motion hooks are used for hero section animations
- **Timeline Tests**: Verify sequential delays for timeline cities (0ms, 200ms, 400ms)
- **Lenis Tests**: Verify Lenis configuration (`smooth: true`, `smoothTouch: false`)
- **Cursor Tests**: Verify custom cursor dimensions (32px hover) and mobile detection

### Property-Based Tests

- **Z-Index Property Test**: Generate random DOM states and verify z-index values maintain correct layering
- **Parallax Property Test**: Generate random scroll positions and verify GPU-accelerated transforms
- **Timeline Property Test**: Generate random city configurations and verify sequential delays
- **Preservation Property Test**: Generate random viewport sizes and verify unchanged behaviors

### Integration Tests

- **Hero Integration Test**: Full hero section render with correct z-index and parallax animations
- **Timeline Integration Test**: Full About section render with sequential timeline reveals
- **Production Polish Integration Test**: Full page render with Lenis, custom cursor, and polaroid hover effects
- **Cross-Browser Integration Test**: Verify smooth scrolling and animations across Chrome, Firefox, Safari

## Implementation Checklist

- [ ] Fix Hero z-index: Swap mountains to z-30, text to z-20, figure to z-40
- [ ] Migrate Hero parallax to Framer Motion: useScroll, useTransform hooks
- [ ] Implement GPU-accelerated transforms with motion.div wrappers
- [ ] Add sequential timeline reveals to About section with useInView
- [ ] Configure Lenis with `smooth: true` and `smoothTouch: false`
- [ ] Update custom cursor hover dimensions to 32px
- [ ] Add polaroid card hover effects (translateY(-8px), scale(1.02), sakura pink glow)
- [ ] Add mobile detection to hide custom cursor on devices with window.innerWidth < 768
- [ ] Run unit tests for all fixes
- [ ] Run property-based tests for preservation
- [ ] Run integration tests for full page flow
- [ ] Verify cross-browser compatibility
