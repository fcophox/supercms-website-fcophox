import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
    return (
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '44px', height: '24px' }}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: checked ? 'hsl(var(--primary))' : '#3f3f46',
                    transition: '0.3s',
                    borderRadius: '34px',
                }}></span>
                <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: checked ? '22px' : '4px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></span>
            </div>
            {label && (
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>{label}</span>
            )}
        </label>
    );
};
