import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../../entities/object/types/ObjectTypes.ts';
import React from 'react';

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
        background: slide?.background?.type === 'color' ? slide.background.value : undefined,
        backgroundSize: slide?.background?.type === 'image' ? 'cover' : undefined,
        backgroundImage:
            slide?.background?.type === 'image' ? `url(${slide.background.value})` : undefined,
        backgroundPosition: 'center',
    };

    const renderObject = (obj: SlideObject) => {
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: obj.x,
            top: obj.y,
        };

        if (obj.type === 'text') {
            return (
                <div
                    key={obj.id}
                    style={{
                        ...baseStyle,
                        padding: '4px 8px',
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: 4,
                        fontSize: obj.fontSize ?? 16,
                        color: obj.color ?? '#111',
                    }}
                >
                    {obj.content}
                </div>
            );
        }

        if (obj.type === 'image') {
            return (
                <img
                    key={obj.id}
                    src={obj.src}
                    alt=""
                    style={{
                        ...baseStyle,
                        width: obj.width ?? 120,
                        height: obj.height ?? 90,
                        objectFit: 'cover',
                        borderRadius: 4,
                    }}
                />
            );
        }

        return null;
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <div style={viewportStyle} role="region" aria-label="Slide viewport">
                {slide ? (
                    <>
                        <div
                            style={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.8)',
                                borderRadius: 4,
                                fontSize: 18,
                                fontWeight: 600,
                                color: '#111827',
                            }}
                        >
                            {slide.title ?? 'Untitled slide'}
                        </div>

                        {slide.objects.map(renderObject)}

                        {slide.objects.length === 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 12,
                                    left: 12,
                                    padding: '6px 8px',
                                    background: 'rgba(0,0,0,0.35)',
                                    color: '#fff',
                                    fontSize: 12,
                                    borderRadius: 4,
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
