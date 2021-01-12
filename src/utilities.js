function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomIndexFrom(array) {
  return Math.floor(Math.random() * array.length)
}

function randomItemFrom(array) {
  return array[randomIndexFrom(array)]
} 

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default {
  sleep, 
  randomIndexFrom,
  randomItemFrom,
  shuffle
};