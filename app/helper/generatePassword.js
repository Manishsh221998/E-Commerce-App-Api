module.exports=generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

