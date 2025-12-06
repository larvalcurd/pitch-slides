import React from 'react';
import styles from './PresentationTitle.module.css';

type PresentationTitleProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
};

export default function PresentationTitle({ title, onTitleChange }: PresentationTitleProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        onTitleChange(newTitle);
        console.log(newTitle);
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>Presentation Title</label>
            <input
                className={styles.input}
                value={title}
                onChange={handleChange}
                placeholder="Enter Presentation title"
            />
        </div>
    );
}
