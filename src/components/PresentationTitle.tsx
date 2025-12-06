import React from 'react';

type PresentationTitleProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
}

export default function PresentationTitle({ title, onTitleChange }: PresentationTitleProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        onTitleChange(newTitle);
        console.log(newTitle);
    };

    return (
        <div style={{ maxWidth: 760, marginBottom: 24 }}>
    <label style={{ display: 'block', fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
    Presentation title
    </label>
    <input
    value={title}
    onChange={handleChange}
    placeholder="Enter presentation title..."
    style={{
        fontSize: 20,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            width: '100%',
            boxSizing: 'border-box',
    }}
    />
    </div>
);

}

