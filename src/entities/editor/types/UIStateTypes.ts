import type { ResizeHandle } from "../../object";

export type DragState = {
    objectIds: string[];
    initialMouseX: number;
    initialMouseY: number;
    initialObjectPositions: { [objectId: string]: { x: number; y: number } };
};

export type ResizeState = {
    objectId: string;
    handle: ResizeHandle;
    startMouseX: number;
    startMouseY: number;
    origianl: {
        x: number;
        y: number;
        width: number;
        height: number;
    }
};

export type DragPreview = {
    positions: { [objectId: string]: { x: number; y: number } };
};

export type ResizePreview = {
    x: number;
    y: number;
    width: number;
    height: number;
};