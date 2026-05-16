export default function LiquidFilters() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0 }}
      aria-hidden="true"
    >
      <defs>
        <filter id="liquid-glass-water" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            id="turbulence"
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="real-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
            in="noise"
            result="softNoise"
          />
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="10"
            result="blurred"
          />
          <feDisplacementMap
            in="blurred"
            in2="softNoise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feSpecularLighting
            in="softNoise"
            surfaceScale="5"
            specularConstant="0.75"
            specularExponent="20"
            lighting-color="#ffffff"
            result="light"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite
            in="light"
            in2="refracted"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>

        <filter id="chromatic-aberration" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="red" />
          <feOffset in="SourceGraphic" dx="0" dy="0" result="green" />
          <feOffset in="SourceGraphic" dx="1.5" dy="0" result="blue" />
          <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-channel" />
          <feColorMatrix in="green" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-channel" />
          <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-channel" />
          <feBlend in="red-channel" in2="green-channel" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue-channel" mode="screen" />
        </filter>

        <filter id="noise-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="grayNoise"
          />
          <feComponentTransfer in="grayNoise" result="fadedNoise">
            <feFuncA type="linear" slope="0.04" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="fadedNoise" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
}
