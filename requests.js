const url = "https://catfact.ninja/fact?max_length=50";
const factsContainer = document.querySelector("#cats-facts");
const marquee = document.querySelector(".marquee");



async function loadFact() {
  const resp = await fetch(url, { mode: 'cors' });
  const json = await resp.json();
  return json.fact;
}

function paintFact(fact) {
  const div = document.createElement("div");
  div.innerText = "NUEVO FACTO: " + fact;
  div.classList.add("cat-fact");
  factsContainer.appendChild(div);

  if (factsContainer.children.length > 2) {
    factsContainer.removeChild(factsContainer.firstChild);
  }
}

async function showFact() {
  const fact = await loadFact();
  paintFact(fact);
}

function cleanupOne() {
    div.removeChild(div.firstChild);
}


await showFact();
await showFact();

setInterval(showFact, 10000);
// setTimeout(() => setInterval(cleanupOne, 5000),10000);



