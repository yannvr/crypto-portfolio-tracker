export interface StatItemProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, valueClassName = '' }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className={`text-xl font-bold ${valueClassName}`}>
      {value}
    </p>
  </div>
);

// Loading variant of StatItem for consistent loading states
export const LoadingStatItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="py-2">
    <p className="text-gray-400">{label}</p>
    <p className="text-xl font-bold text-gray-300">Loading...</p>
  </div>
);
