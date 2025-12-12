import React from 'react';
import type { Slide } from '../../entities/slide/types/SlideTypes.ts';
import type {
    SlideObject,
    TextObject,
    ImageObject,
} from '../../entities/object/types/ObjectTypes.ts';

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
        backgroundColor: slide?.background?.type === 'color' ? slide.background.value : undefined,
        backgroundImage: slide?.background?.type === 'image' ? `url(${slide.background.value})` : undefined,
        backgroundSize: slide?.background?.type === 'image' ? 'cover' : undefined,
        backgroundPosition: slide?.background?.type === 'image' ? 'center' : undefined,
    };

    const handleObjectClick = (id: string, backgroundColor: string) => {
        console.log(id, backgroundColor);
    };

    const renderObject = (obj: SlideObject) => {
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: obj.x,
            top: obj.y,
            width: obj.width,
            height: obj.height,
            zIndex: obj.zIndex,
            boxSizing: 'border-box',
            cursor: 'pointer',
        };

        if (obj.type === 'text') {
            const text = obj as TextObject;
            const textStyle: React.CSSProperties = {
                ...baseStyle,
                padding: '4px 8px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: 4,
                fontSize: text.fontSize ?? 16,
                color: text.color ?? '#111',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            };

            const bg =
                (textStyle.background as string) ??
                (slide?.background?.type === 'color' ? slide.background.value : 'transparent');

            return (
                <div
                    key={text.id}
                    style={textStyle}
                    data-object-id={text.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleObjectClick(text.id, bg)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleObjectClick(text.id, bg);
                            e.preventDefault();
                        }
                    }}
                    aria-label={`Text object ${text.id}`}
                >
                    {text.content}
                </div>
            );
        }

        if (obj.type === 'image') {
            const image = obj as ImageObject;
            const imgWrapperStyle: React.CSSProperties = {
                ...baseStyle,
                display: 'block',
                overflow: 'hidden',
            };

            const bg =
                (imgWrapperStyle.background as string) ??
                (slide?.background?.type === 'color' ? slide.background.value : 'transparent');

            return (
                <div
                    key={image.id}
                    style={imgWrapperStyle}
                    data-object-id={image.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleObjectClick(image.id, bg)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleObjectClick(image.id, bg);
                            e.preventDefault();
                        }
                    }}
                    aria-label={`Image object ${image.id}`}
                >
                    <img
                        src={image.src}
                        alt={image.src ? 'Slide image' : ''}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            border: 'none',
                        }}
                    />
                </div>
            );
        }
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
