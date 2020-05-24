import React from 'react';
import { Checkbox as PrettyCheckbox } from 'pretty-checkbox-react';
export { Group as OptionsGroup } from 'pretty-checkbox-react';

const Icons = {
  check: (color = 'white') => (
    <svg viewBox="0 0 20 20" className="svg">
      <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style={{ stroke: color, fill: color }}></path>
    </svg>
  ),
  lock: (color = '#65bbd2') => (
    <svg viewBox="0 0 8 8" className="svg">
      <path fill={color} d="M4 0c-1.099 0-2 .901-2 2v1h-1v4h6v-4h-1v-1c0-1.099-.901-2-2-2zm0 1c.561 0 1 .439 1 1v1h-2v-1c0-.561.439-1 1-1z"></path>
    </svg>
  )
}

export default function CheckBox({
  label,
  shape = 'curve',
  color = 'primary',
  icon = 'check',
  ...rest
}) {
  const svg = icon in Icons && Icons[icon]();


  return <PrettyCheckbox shape={shape} color={color} icon={svg} {...rest}>{label}</PrettyCheckbox>;
}
