export const haptic = {
  tap:     () => navigator.vibrate?.(50),
  success: () => navigator.vibrate?.([50, 30, 80]),
  error:   () => navigator.vibrate?.([200]),
};
