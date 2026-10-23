type Props = {
  label: string;
  value: number;
};

export default function ScoreCard({ label, value }: Props) {
  return (
    <div className="rounded-2xl border border-[#E8D8D0] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#756B66]">
          {label}
        </p>

        <p className="text-2xl font-bold text-[#302B28]">
          {value.toFixed(1)}%
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F6E5DE]">

        <div
          className="h-full rounded-full bg-[#F4512C] transition-all duration-500"
          style={{
            width: `${Math.min(Math.max(value, 0), 100)}%`,
          }}
        />

      </div>

    </div>
  );
}