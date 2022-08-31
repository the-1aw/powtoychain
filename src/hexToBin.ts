const hex2bin = (str: string): string => {
  return Array.from(Buffer.from(str, 'hex'))
    .map((dec) => {
      const bin: string = dec.toString(2);
      return `${'00000000'.substring(bin.length)}${bin}`;
    })
    .join('');
};

export default hex2bin;
