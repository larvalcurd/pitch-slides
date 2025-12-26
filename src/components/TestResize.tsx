import { useResizable } from '../hooks/useResizable';

const TestResize = () => {
  const {
    isResizing,
    currentState: { x: currentX, y: currentY, width: currentWidth, height: currentHeight },
    startResize,
  } = useResizable({
    initialX: 100,
    initialY: 100,
    initialWidth: 200,
    initialHeight: 150,
    onResizeEnd: state => {
      console.log('Resize end:', state);
    },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: currentX,
        top: currentY,
        width: currentWidth,
        height: currentHeight,
        border: '2px solid blue',
        background: isResizing ? 'lightblue' : 'white',
      }}
    >
      {/* Bottom-right handle */}
      <div
        style={{
          position: 'absolute',
          right: -5,
          bottom: -5,
          width: 10,
          height: 10,
          background: 'blue',
          cursor: 'nwse-resize',
        }}
        onMouseDown={e => startResize(e, 'bottom-right')}
      />
    </div>
  );
};

export default TestResize;
