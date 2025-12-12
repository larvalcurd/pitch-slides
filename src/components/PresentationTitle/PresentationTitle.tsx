import React from 'react';

type PresentationTitleProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
};

export function PresentationTitle({ title, onTitleChange }: PresentationTitleProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        onTitleChange(newTitle);
        console.log(newTitle);
    };

    return (
        <input
            id="presentation-title"
            name="presentationTitle"
            value={title}
            onChange={handleChange}
            placeholder="Enter Presentation title"
        />
    );
}
