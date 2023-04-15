export const randomString = (length: number) => {
  let result = "";
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += String.fromCharCode(characters.charCodeAt(randomIndex));
  }

  return result;
};
