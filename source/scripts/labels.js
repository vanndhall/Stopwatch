const LANGS = ['en', 'nl'];

let index = LANGS.indexOf(localStorage.getItem('language'));

if(index == -1) index = 0;

let labels = {
  english: ['English', 'Engels'],
  dutch: ['Dutch', 'Nederlands'],
  intro: [
    `
      hello world!
    `,
    `
      hallo wereld!
    `
  ]
};

for(let n in labels) {

  if(!labels.hasOwnProperty(n)) continue;

  if(labels[n] == false) labels[n] = n;

  else labels[n] = labels[n][index];

}

module.exports = labels;

function placeholder(label){

  return (el) => el.setAttribute('placeholder', label);

}

function title(label){

  return (el) => el.setAttribute('data-title', label);

}