'use client';

import { GraduationCap, Users, FileText, ClipboardCheck, Check } from 'lucide-react';

const steps = [
  { label: 'Learner', icon: GraduationCap },
  { label: 'Guardian', icon: Users },
  { label: 'Documents', icon: FileText },
  { label: 'Review', icon: ClipboardCheck },
];

export default function StepperHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10">
      {/* Desktop: horizontal stepper */}
      <div className="hidden items-center md:flex">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div key={step.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                    isDone
                      ? 'border-canopy bg-canopy text-white'
                      : isActive
                      ? 'border-loam bg-loam text-white'
                      : 'border-border bg-surface text-mist'
                  }`}
                >
                  {isDone ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isActive || isDone ? 'text-canopy' : 'text-mist'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-3 h-px flex-1 ${i < currentStep ? 'bg-canopy' : 'bg-border'}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: compact progress */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-canopy">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-mist">{steps[currentStep].label}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-loam transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
