import React from "react";

const StarburstBadge = ({ 
  text, 
  color = "orange", 
  size = "md", 
  className = "",
  animate = true
}) => {
  const colorMap = {
    // Official Neobrutalism tokens
    primary:   { fill: "#FDC800", text: "#1C293C" },
    secondary: { fill: "#432DD7", text: "#FFFFFF" },
    success:   { fill: "#16A34A", text: "#FFFFFF" },
    warning:   { fill: "#D97706", text: "#FFFFFF" },
    danger:    { fill: "#DC2626", text: "#FFFFFF" },
    surface:   { fill: "#FBFBF9", text: "#1C293C" },
    
    // Aesthetic accents
    orange:    { fill: "#FF4D2D", text: "#FFFFFF" },
    gold:      { fill: "#FDC800", text: "#1C293C" },
    purple:    { fill: "#432DD7", text: "#FFFFFF" },
    cyan:      { fill: "#22D3EE", text: "#1C293C" },
    sakura:    { fill: "#FF6B9D", text: "#FFFFFF" },
    yellow:    { fill: "#FDC800", text: "#1C293C" },
  };

  const selectedColor = colorMap[color] || colorMap.orange;

  const sizeMap = {
    sm: { width: 44, height: 44, fontSize: "9px" },
    md: { width: 62, height: 62, fontSize: "11px" },
    lg: { width: 84, height: 84, fontSize: "13px" },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  // 12-point starburst polygon path
  return (
    <div 
      className={`starburst-sticker ${animate ? 'animate-badge-glint' : ''} ${className}`}
      style={{ width: selectedSize.width, height: selectedSize.height }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width={selectedSize.width} 
        height={selectedSize.height}
        className="w-full h-full"
      >
        {/* 12-point spiky star shape */}
        <polygon
          points="50,2 62,17 82,10 85,30 100,42 90,60 97,79 78,83 72,100 52,91 36,99 30,81 12,80 18,60 5,44 20,32 19,12 38,18"
          fill={selectedColor.fill}
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {text && (
          <text
            x="50"
            y="54"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={selectedColor.text}
            fontSize={selectedSize.fontSize === "13px" ? "15" : selectedSize.fontSize === "11px" ? "13" : "11"}
            fontWeight="900"
            fontFamily="Orbitron, Rajdhani, sans-serif"
            letterSpacing="0.05em"
            stroke="#000000"
            strokeWidth="0.8"
            paintOrder="stroke fill"
          >
            {text}
          </text>
        )}
      </svg>
    </div>
  );
};

export default StarburstBadge;
