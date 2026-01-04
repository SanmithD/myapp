const days = ["monday","tuesday","wednesday","thursday","friday"];

const WeekGraph = ({ week }) => {
  const peaks = days.map(d => Number(week[d]?.peak || 0));
  const max = Math.max(...peaks);

  return (
    <svg viewBox="0 0 500 200" className="w-full h-48 text-gray-700 border rounded">
      {peaks.map((val, i) => {
        const x = 50 + i * 90;
        const y = 180 - (val / max) * 150;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="6"
            fill={val === max ? "red" : "black"}
          />
        );
      })}

      <polyline
        fill="none"
        stroke="black"
        strokeWidth="2"
        points={peaks
          .map((val, i) => {
            const x = 50 + i * 90;
            const y = 180 - (val / max) * 150;
            return `${x},${y}`;
          })
          .join(" ")}
      />
    </svg>
  );
};

export default WeekGraph;
