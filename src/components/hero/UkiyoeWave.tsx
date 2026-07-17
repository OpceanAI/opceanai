/**
 * Aizuri-e wave scene — the site's signature artifact. An original
 * composition in the Hokusai manner: flat indigo color planes (no gradients),
 * bold sumi-ink outlines, and a great wave rising off the right edge whose
 * lip breaks into curled foam claws. Every plane is a tonal step of the same
 * indigo (--wave-1 … --wave-5); foam is washi white.
 *
 * Layers back-to-front, each its own <g data-layer> so ParallaxScene can
 * move them at different speeds:
 *   sky → distant → far → mid → great (carries its own foam, glued to the
 *   lip) → spray (detached droplets, fastest) → fore.
 *
 * The foam is built as a narrow band stroked along the lip, with a single
 * hand-drawn claw re-used at decreasing scale and increasing rotation as the
 * curl tightens — the way a block-cutter repeats a knife motif. Foam groups
 * carry a slow translateY bob (the print breathes); gated behind
 * prefers-reduced-motion in CSS.
 */
export default function UkiyoeWave({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      className={className}
      role="img"
      aria-label="Indigo woodblock print of a great cresting wave with curled foam claws"
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        {/* One hand-drawn foam claw: a solid comma — wide base, tapering blade,
            tip hooking left into the barrel. */}
        <path
          id="foam-claw"
          d="M -12 0
             C 2 -6, 16 0, 21 12
             C 26 26, 22 44, 8 56
             C 2 64, -8 68, -17 61
             C -9 56, -3 47, -3 33
             C -3 19, -7 8, -12 0 Z"
        />
      </defs>

      {/* ——— Sky: empty Ma for the headline, one flat bokashi band at the horizon. */}
      <g data-layer="sky">
        <rect x="-40" y="-40" width="1520" height="980" fill="var(--wave-sky)" />
        <rect x="-40" y="468" width="1520" height="472" fill="var(--wave-band)" />
      </g>

      {/* ——— Distant swell along the horizon line. */}
      <g data-layer="distant">
        <path
          d="M -40 560
             C 80 546, 160 560, 260 553
             C 380 544, 460 561, 580 554
             C 700 547, 780 563, 900 556
             C 1020 549, 1100 565, 1220 558
             C 1320 552, 1400 561, 1460 556
             L 1460 940 L -40 940 Z"
          fill="var(--wave-1)"
          stroke="var(--wave-ink)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>

      {/* ——— Far rolling swell. */}
      <g data-layer="far">
        <path
          d="M -40 622
             C 120 600, 240 618, 380 605
             C 540 590, 660 614, 820 601
             C 980 588, 1120 612, 1280 599
             C 1380 590, 1420 601, 1460 596
             L 1460 940 L -40 940 Z"
          fill="var(--wave-2)"
          stroke="var(--wave-ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Small ink crest curls riding the far swell. */}
        <path d="M 250 614 c 14 -12, 34 -12, 44 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 640 608 c 14 -12, 34 -12, 44 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 1080 606 c 14 -12, 34 -12, 44 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ——— Mid swell — a smooth rolling mass carrying the cutter's water lines. */}
      <g data-layer="mid">
        <path
          d="M -40 704
             C 80 664, 200 646, 330 654
             C 480 664, 610 682, 760 692
             C 930 703, 1080 690, 1220 701
             C 1330 709, 1400 703, 1460 707
             L 1460 940 L -40 940 Z"
          fill="var(--wave-3)"
          stroke="var(--wave-ink)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Horizontal water strokes — print texture, not decoration spam. */}
        <path d="M 60 736 C 200 722, 360 734, 520 728" fill="none" stroke="var(--wave-ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <path d="M 180 776 C 340 762, 520 774, 690 768" fill="none" stroke="var(--wave-ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        <path d="M 40 700 c 16 -13, 38 -13, 50 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* ——— The great wave, rising off the right edge, lip curling back left. */}
      <g data-layer="great">
        <g data-drift="0.6">
        <g transform="translate(50 0)">
          <path
            d="M 1460 522
               C 1400 468, 1352 398, 1292 340
               C 1230 280, 1140 250, 1050 262
               C 960 274, 880 322, 838 382
               C 820 408, 830 438, 862 444
               C 838 472, 850 512, 902 542
               C 982 590, 1092 622, 1202 662
               C 1302 698, 1392 732, 1460 752
               Z"
            fill="var(--wave-4)"
            stroke="var(--wave-ink)"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Inner face stripe — a lighter plane inside the wave body, as a
              second block would print it. */}
          <path
            d="M 930 520
               C 1000 448, 1090 396, 1190 372
               C 1270 353, 1350 366, 1408 404
               C 1340 384, 1262 380, 1188 400
               C 1094 426, 1014 480, 962 548
               C 950 540, 938 530, 930 520 Z"
            fill="var(--wave-3)"
          />

          {/* Face lines — cutter's strokes following the wave's pull. */}
          <path d="M 1160 380 C 1080 420, 1010 480, 972 540" fill="none" stroke="var(--wave-ink)" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
          <path d="M 1270 400 C 1190 452, 1120 520, 1080 586" fill="none" stroke="var(--wave-ink)" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
          <path d="M 1370 430 C 1300 490, 1236 556, 1200 618" fill="none" stroke="var(--wave-ink)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />

          {/* Crest foam — a narrow band hugging the lip, claws hanging into the barrel. */}
          <g className="foam-bob-a">
            <path
              d="M 1310 348
                 C 1258 288, 1160 252, 1060 262
                 C 968 272, 890 320, 848 382
                 C 832 406, 838 430, 858 438"
              fill="none"
              stroke="var(--wave-foam)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Claw row — one knife motif, smaller and more rotated as the curl tightens. */}
            <g fill="var(--wave-foam)">
              <use href="#foam-claw" transform="translate(1240 336) rotate(30) scale(0.9)" />
              <use href="#foam-claw" transform="translate(1152 300) rotate(38) scale(1)" />
              <use href="#foam-claw" transform="translate(1060 288) rotate(46) scale(1)" />
              <use href="#foam-claw" transform="translate(972 308) rotate(56) scale(0.9)" />
              <use href="#foam-claw" transform="translate(906 342) rotate(70) scale(0.8)" />
              <use href="#foam-claw" transform="translate(866 386) rotate(86) scale(0.68)" />
              <use href="#foam-claw" transform="translate(852 424) rotate(104) scale(0.52)" />
            </g>
          </g>
        </g>
        </g>
      </g>

      {/* ——— Detached spray inside the barrel hollow — the one layer running ahead. */}
      <g data-layer="spray">
        <g data-drift="1">
        <g className="foam-bob-b" fill="var(--wave-foam)">
          <circle cx="902" cy="296" r="4" />
          <circle cx="858" cy="336" r="5" />
          <circle cx="886" cy="378" r="3" />
          <circle cx="838" cy="404" r="4" />
          <circle cx="874" cy="446" r="3.5" />
          <circle cx="842" cy="488" r="2.5" />
          <circle cx="918" cy="352" r="2.5" />
          <path d="M 894 416 c 4 -8, 12 -8, 14 0 c 2 8, -6 12, -10 8 c -4 -3, -6 -4, -4 -8 Z" />
          <path d="M 852 366 c 3 -6, 10 -6, 12 0 c 2 6, -5 10, -8 6 c -3 -2, -5 -3, -4 -6 Z" />
        </g>
        </g>
      </g>

      {/* ——— Foreground trough, deepest indigo, anchoring the bottom edge. */}
      <g data-layer="fore">
        <path
          d="M -40 940 L -40 812
             C 140 782, 300 802, 470 792
             C 650 780, 800 800, 980 790
             C 1150 781, 1300 798, 1460 790
             L 1460 940 Z"
          fill="var(--wave-5)"
          stroke="var(--wave-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M 380 800 c 12 -10, 30 -10, 40 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M 880 796 c 12 -10, 30 -10, 40 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M 1230 794 c 12 -10, 30 -10, 40 2" fill="none" stroke="var(--wave-ink)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}
