/*function fetchData(url, method, body) {
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body)
  })
}*/
const quoteList = document.querySelector("#quote-list");

fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(quotes => renderQuotes(quotes))

//Loop through quotes
function renderQuotes(quotes) {
  quotes.forEach(quote => renderQuote(quote))
}

//Show quotes on screen
function renderQuote(quote) {
  const quoteLi = document.createElement("li");
  quoteLi.className = "quote-card";
  quoteLi.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>0</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>
  `
  quoteList.append(quoteLi);

  quoteLi.querySelector(".btn-danger").addEventListener("click", () => handleDeleteClick(quote))
}

//Submit new quote
const quoteForm = document.querySelector("#new-quote-form");
quoteForm.addEventListener("submit", (e) => handleSubmit(e));

function handleSubmit(e) {
  e.preventDefault();
  const newQuote = e.target["new-quote"].value
  const newAuthor = e.target.author.value

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
    .then(res => res.json())
    .then(quote => renderQuote(quote))
  e.target.reset();
}

//Delete quote
function handleDeleteClick(quote) {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => {
      quoteList.innerHTML = "";
      fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then(quotes => renderQuotes(quotes))
    })
}