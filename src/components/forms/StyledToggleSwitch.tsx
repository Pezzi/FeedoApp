// src/components/forms/StyledToggleSwitch.tsx

import React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

interface StyledToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const StyledToggleSwitch: React.FC<StyledToggleSwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <SwitchPrimitives.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-realce focus:ring-offset-2
                 focus:ring-offset-fundo-card data-[state=checked]:bg-realce data-[state=unchecked]:bg-[#1E1E1E]"
    >
      <SwitchPrimitives.Thumb
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 
                   transition duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitives.Root>
  );
};