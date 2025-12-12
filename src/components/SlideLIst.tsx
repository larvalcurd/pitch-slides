import type { Slide } from '../entities/slide/types/SlideTypes.ts';

type SlideListProps = {
    slides: Slide[];
    selectedSlideId?: string | null;
    onSelect?: (slideId: string) => void;
    width?: number; // optional width in px
};

const containerStyle = (width: number) => ({
    width: `${width}px`,
    minWidth: `${width}px`,
    height: '100vh',
    overflowY: 'auto' as const,
    background: '#f3f4f6',
    padding: '8px',
    boxSizing: 'border-box' as const,
    borderRight: '1px solid rgba(0,0,0,0.08)',
});

const itemStyleBase = {
    height: '120px',
    marginBottom: '8px',
    borderRadius: '6px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    display: 'flex' as const,
    alignItems: 'stretch' as const,
};

const thumbnailInnerStyle = {
    flex: 1,
    display: 'flex' as const,
    alignItems: 'flex-end' as const,
    padding: '6px',
    color: '#111827',
    fontSize: '12px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(2px)',
};

export default function SlideList({
    slides,
    selectedSlideId,
    onSelect,
    width = 220,
}: SlideListProps) {
    const handleClick = (id: string) => {
        console.log(id);
        if (onSelect) onSelect(id);
    };

    return (
        <aside style={containerStyle(width)} aria-label="Slides list">
            {slides.map((slide) => {
                const isSelected = slide.id === selectedSlideId;
                const itemStyle = {
                    ...itemStyleBase,
                    border: isSelected ? '2px solid #2563eb' : '1px solid rgba(0,0,0,0.06)',
                    background:
                        slide.background?.type === 'color'
                            ? slide.background.value
                            : slide.background?.type === 'image'
                              ? `url(${slide.background.value}) center/cover no-repeat`
                              : '#ffffff',
                };

                return (
                    <div
                        key={slide.id}
                        style={itemStyle}
                        onClick={() => handleClick(slide.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleClick(slide.id);
                                e.preventDefault();
                            }
                        }}
                        aria-pressed={isSelected}
                    >
                        <div style={thumbnailInnerStyle}>{slide.title ?? 'Untitled slide'}</div>
                    </div>
                );
            })}
        </aside>
    );
}
