import { Slider } from '@/components/ui/slider';

interface LifespanSliderProps {
  lifespan: number;
  onLifespanChange: (value: number) => void;
}

export default function LifespanSlider({ lifespan, onLifespanChange }: LifespanSliderProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-gray font-dm-sans">
        Expected Lifespan 💀
      </label>
      <div className="space-y-3">
        <Slider
          value={[lifespan]}
          onValueChange={(value) => onLifespanChange(value[0])}
          max={100}
          min={60}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-gray font-dm-sans">
          <span>60 years</span>
          <span className="font-bold text-coral-pink text-lg">{lifespan} years</span>
          <span>100 years</span>
        </div>
      </div>
    </div>
  );
}