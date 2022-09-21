const validateAddress = (addr: string): boolean => {
  if (addr.length !== 130) {
    return false;
  }
  if (addr.match('^[a-fA-F0-9]+$') === null) {
    return false;
  }
  if (!addr.startsWith('04')) {
    return false;
  }
  return true;
};

export default validateAddress;
