/* eslint-disable */

function rpl(inp, measure) {
  return inp.replace(new RegExp(`(^.+ ${measure})(.+)`), (_, b, c) => `${c.trim()}, ${b}`)
}

;(function () {
  const t = document.querySelector('h1').innerText.replace('recipe', '').trim()
  const items = [...document.querySelectorAll('.ingredient')]
    .map((e) => rpl(rpl(rpl(rpl(rpl(rpl(e.innerText, 'shot'), 'part'), 'oz'), 'splash'), 'ml'), 'dash').trim())
    .map((i) => `- ${i.slice(0, 1).toUpperCase()}${i.slice(1)}`.replace('®', ''))
  const steps = document
    .querySelector('.RecipeDirections.instructions')
    .innerText.split('. ')
    .map((i) => `- ${i.trim()}`)
  console.info(`

# ${t}

## Ingredients

${items.join('\n')}

## Steps

${steps.join('\n').replace('Volume 0%', '').trim()}

---
`)
})()
