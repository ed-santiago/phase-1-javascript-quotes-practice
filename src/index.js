fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(quotes => renderQuotes(quotes))

//Loop through quotes
function renderQuotes(quotes) {
  quotes.forEach(quote => renderQuote(quote))
}

//Show quotes on screen
function renderQuote(quote) {
  const quoteList = document.querySelector("#quote-list");
  const quoteLi = document.createElement("li");
  quoteLi.className = "quote-card";
  console.log(quote)
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
}