import { Slider } from '@/components/ui/slider';

interface HabitInputProps {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  unit: string;
}

export default function HabitInput({ icon, label, value, onChange, max, unit }: HabitInputProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-gray font-dm-sans">
        {icon} {label}
      </label>
      <div className="space-y-3">
        <Slider
          value={[value]}
          onValueChange={(newValue) => onChange(newValue[0])}
          max={max}
          min={0}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-gray font-dm-sans">
          <span>0 {unit}</span>
          <span className="font-bold text-coral-pink text-lg">{value} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  );
}