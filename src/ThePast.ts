let prevImageDatas = [];

export const saveImageData = (imageData) => {
  prevImageDatas.unshift(imageData);
  prevImageDatas = prevImageDatas.slice(0, 5);
};

export const getPast = (i) => {
  let maybeImageData = prevImageDatas[0];
  if (maybeImageData) {
    return maybeImageData.data[i]
  }
  return 0
};