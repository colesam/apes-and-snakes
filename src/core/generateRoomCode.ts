const generateRoomCode = () => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  while (res.length < 4) {
    res += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return res;
};

export default generateRoomCode;
