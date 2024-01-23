String.prototype.randomLimit = function (size) {
  const option = this;
  let text = '';

  for (let i = 0; i < size; i++) {
    text += option.charAt(Math.floor(Math.random() * option.length));
  }
  return text;
} ;

String.randomString = function(size, kase) {
  let option = 'abcdefghijklmnopqrstuvwxyz0123456789';
  if (kase){
    option = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  return option.randomLimit(size);
};