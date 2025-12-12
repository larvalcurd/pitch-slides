import React from 'react';
import type { Slide } from '../../entities/slide/types/SlideTypes.ts';

type Props = {
    slide?: Slide | null;
    slideWidth?: number;
    slideHeight?: number;
};

export default function SlideCanvas({ slide, slideWidth = 960, slideHeight = 540 }: Props) {
    const viewportStyle: React.CSSProperties = {
        width: slideWidth,
        height: slideHeight,
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 6,
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
    };

    const renderBackground = () => {
        if (!slide?.background) return {};
        if (slide.background.type === 'color') return { backgroundColor: slide.background.value };
        if (slide.background.type === 'image')
            return {
                backgroundImage: `url(${slide.background.value})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        return {};
    };

    const wrapperStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: 16,
        boxSizing: 'border-box',
    };

    const titleStyle: React.CSSProperties = {
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.8)',
        margin: 12,
        borderRadius: 4,
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 600,
        color: '#111827',
    };

    const objectsPlaceholderStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 12,
        left: 12,
        padding: '6px 8px',
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        fontSize: 12,
        borderRadius: 4,
    };

    return (
        <div style={wrapperStyle} aria-label="Slide preview area">
            <div
                style={{ ...viewportStyle, ...renderBackground() }}
                role="region"
                aria-label="Slide viewport"
            >
                {slide ? (
                    <>
                        <div style={titleStyle}>{slide.title ?? 'Untitled slide'}</div>

                        {/* Basic objects placeholder — replace with real object rendering later */}
                        {slide.objects && slide.objects.length > 0 ? (
                            <div
                                style={objectsPlaceholderStyle}
                            >{`${slide.objects.length} object(s)`}</div>
                        ) : (
                            <div
                                style={{
                                    ...objectsPlaceholderStyle,
                                    background: 'rgba(0,0,0,0.35)',
                                }}
                            >
                                No objects
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ margin: 'auto', color: '#6b7280' }}>No slide selected</div>
                )}
            </div>
        </div>
    );
}
