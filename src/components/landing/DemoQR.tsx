/** Pola QR dekoratif (tidak bisa dipindai). */
const SIZE = 21;

function buildPath(seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > SIZE - 9 && y < 8) || (x < 8 && y > SIZE - 9);

  let d = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!inFinder(x, y) && rand() > 0.52) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  // Tiga penanda sudut khas QR.
  for (const [fx, fy] of [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ]) {
    d += `M${fx} ${fy}h7v7h-7zM${fx + 1} ${fy + 1}v5h5v-5zM${fx + 2} ${fy + 2}h3v3h-3z`;
  }
  return d;
}

const PATH = buildPath(815);

export default function DemoQR({ size = 72 }: { size?: number }) {
  return (
    <svg
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="-1" y="-1" width={SIZE + 2} height={SIZE + 2} fill="#FFFFFF" />
      <path d={PATH} fill="#09090B" fillRule="evenodd" />
    </svg>
  );
}
