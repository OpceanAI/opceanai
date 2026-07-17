/**
 * Hanko seal mark — a hand-cut vermillion stamp with a geometric "O"
 * monogram carved out in washi white. The outer edge is deliberately
 * irregular, like a knife-cut stone seal; the ring carries one small break
 * where the carver's blade lifted. This is one of only three places
 * vermillion is allowed to appear.
 */
export default function HankoSeal({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`seal-svg ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Inner group carries the hover stamp keyframe so the press transform
          on the svg root never conflicts with it. */}
      <g className="seal-stamp-inner">
      {/* Irregular hand-cut stamp body, set a touch off square. */}
      <g transform="rotate(-2.5 20 20)">
        <path
          className="seal-impression"
          d="M 4.5 6.5
             C 9 4, 14 5.5, 19 4
             C 24 2.8, 31 4.2, 35 5.5
             C 37.5 10, 35.5 15, 37 20
             C 38.2 25, 36.5 31, 35 34.5
             C 30 37, 25 35.2, 20 36.5
             C 15 37.8, 9 36.8, 5.5 35
             C 3.5 30, 5 25, 3.8 20
             C 2.8 15.5, 3.2 10.5, 4.5 6.5 Z"
          fill="var(--color-seal)"
        />
        {/* Carved "O" impression, washi white, with one blade break. */}
        <path
          d="M 20 10
             A 10 10 0 1 0 20.2 10"
          fill="none"
          stroke="#f2ede4"
          strokeWidth="3.4"
          strokeLinecap="round"
          transform="rotate(58 20 20)"
        />
      </g>
      </g>
    </svg>
  );
}
