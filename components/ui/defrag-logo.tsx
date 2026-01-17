export function DefragLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer rings - cymatic pattern */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="50" cy="50" r="17" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />

            {/* 8-fold symmetry lines (matching vibrant mandala) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 50
                const y1 = 50
                const x2 = 50 + Math.cos(rad) * 45
                const y2 = 50 + Math.sin(rad) * 45
                return (
                    <line
                        key={angle}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth="0.3"
                        opacity="0.4"
                    />
                )
            })}

            {/* Central petals - 8-fold pattern */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                const rad = (angle * Math.PI) / 180
                const cx = 50 + Math.cos(rad) * 20
                const cy = 50 + Math.sin(rad) * 20
                return (
                    <circle
                        key={`petal-${angle}`}
                        cx={cx}
                        cy={cy}
                        r="6"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.5"
                    />
                )
            })}

            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.8" />
        </svg>
    )
}
