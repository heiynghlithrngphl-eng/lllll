import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

// Generates a deterministic grid pattern resembling a QR code based on string hash
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 180, label }) => {
  const gridSize = 25; // 25x25 matrix
  const moduleSize = size / gridSize;

  // Simple deterministic hash
  const hash = (str: string, seed: number) => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  // Build matrix
  const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  // 1. Finder patterns (7x7 at 3 corners)
  const addFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[startRow + r][startCol + c] = isBorder || isCenter;
      }
    }
  };

  addFinder(0, 0); // Top-left
  addFinder(0, gridSize - 7); // Top-right
  addFinder(gridSize - 7, 0); // Bottom-left

  // 2. Timing lines
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Fill payload area with deterministic bits based on input
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      const inCenterLogo = r >= 10 && r <= 14 && c >= 10 && c <= 14;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenterLogo) {
        const bitHash = hash(value, r * 37 + c * 17);
        matrix[r][c] = (bitHash % 100) < 48; // ~48% density
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-inner">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shape-rendering-crispEdges select-none"
      >
        <rect width={size} height={size} fill="#ffffff" rx={8} />
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (!cell) return null;
            return (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx * moduleSize}
                y={rIdx * moduleSize}
                width={moduleSize - 0.4}
                height={moduleSize - 0.4}
                rx={moduleSize > 6 ? 1 : 0.5}
                fill="#0f172a"
              />
            );
          })
        )}
        {/* Center decorative badge */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={moduleSize * 2.5}
          fill="#ffffff"
          stroke="#0284c7"
          strokeWidth="2"
        />
        <text
          x={size / 2}
          y={size / 2 + 3}
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill="#0284c7"
          fontFamily="sans-serif"
        >
          DBT
        </text>
      </svg>
      {label && (
        <div className="mt-2 text-center">
          <p className="text-xs font-mono font-bold tracking-wider text-slate-700">{label}</p>
          <span className="text-[10px] text-slate-600 font-medium">สแกนเพื่อเช็คอินหน้าห้อง</span>
        </div>
      )}
    </div>
  );
};
