// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let n = 0;
setInterval(() => {
  n++;
}, 1000);

export default function handler(req, res) {
  res.status(200).json({name: `John Snow is ${n} years old`});
}
