import React from 'react';

interface Props {
  text: string;
}

/**
 * Renders fraction notations as proper stacked fractions:
 * - Simple fractions: 3/4 → numerator on top, solid line, denominator below
 * - Mixed numbers: 1 3/4 → big whole number with smaller fraction beside it
 * - Also handles fractions like 22/7
 */
export default function MathFormattedText({ text }: Props) {
  if (!text) return null;

  // Split on fraction patterns: "3 1/4" (mixed) or "3/4" (simple)
  const parts = text.split(/(\b\d+\s+\d+\/\d+\b|\b\d+\/\d+\b)/g);

  return (
    <span>
      {parts.map((part, index) => {
        // Mixed fraction: "3 1/4" → big 3 + small stacked 1/4
        const mixedMatch = part.match(/^(\d+)\s+(\d+)\/(\d+)$/);
        if (mixedMatch) {
          const [, whole, num, den] = mixedMatch;
          return (
            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 3px' }}>
              <span style={{ fontSize: '1.3em', fontWeight: 800, marginRight: '2px', lineHeight: 1 }}>{whole}</span>
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.72em', lineHeight: 1.1, verticalAlign: 'middle' }}>
                <span style={{ borderBottom: '2px solid currentColor', paddingBottom: '1px', paddingLeft: '3px', paddingRight: '3px', fontWeight: 700, textAlign: 'center', width: '100%', display: 'block' }}>{num}</span>
                <span style={{ paddingTop: '1px', paddingLeft: '3px', paddingRight: '3px', fontWeight: 700, textAlign: 'center', width: '100%', display: 'block' }}>{den}</span>
              </span>
            </span>
          );
        }

        // Simple fraction: "3/4" → stacked numerator / line / denominator
        const simpleMatch = part.match(/^(\d+)\/(\d+)$/);
        if (simpleMatch) {
          const [, num, den] = simpleMatch;
          return (
            <span key={index} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', margin: '0 3px', fontSize: '0.88em', lineHeight: 1.1 }}>
              <span style={{ borderBottom: '2px solid currentColor', paddingBottom: '1px', paddingLeft: '4px', paddingRight: '4px', fontWeight: 700, textAlign: 'center', width: '100%', display: 'block' }}>{num}</span>
              <span style={{ paddingTop: '1px', paddingLeft: '4px', paddingRight: '4px', fontWeight: 700, textAlign: 'center', width: '100%', display: 'block' }}>{den}</span>
            </span>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
