import {
  SLIDE_WIDTH,
  DEFAULT_TEXT_X,
  DEFAULT_TEXT_Y,
  DEFAULT_TEXT_WIDTH,
  DEFAULT_TEXT_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_PADDING,
} from '../../../utils/constants';

export const calculateTextPosition = () => ({
  x: DEFAULT_TEXT_X,
  y: DEFAULT_TEXT_Y,
  width: DEFAULT_TEXT_WIDTH,
  height: DEFAULT_TEXT_HEIGHT,
});

export const calculateImagePosition = () => {
  const x = SLIDE_WIDTH - DEFAULT_IMAGE_WIDTH - DEFAULT_IMAGE_PADDING;
  return {
    x,
    y: DEFAULT_TEXT_Y, // #TODO: Adjust if needed
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
  };
};
