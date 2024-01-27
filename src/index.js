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
  console.log(quotes)
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
      <button class='btn-edit'>Edit</button>
    </blockquote>
    <form id="edit-form" style="display: none;">
      <div>
        <label for="edit-quote">Edit Quote</label>
        <textarea id="edit-quote" name="edit-quote" rows="3" cols="80" placeholder="Edit quote"></textarea>
      </div>
      <label for="edit-author">Edit Author</label>
      <input id="edit-author" name="edit-author" type="text" placeholer="edit quote" />
      <input type="submit" value="Submit" />
    </form>
  `
  quoteList.append(quoteLi);

  quoteLi.querySelector(".btn-success").addEventListener("click", () => handleLikeClick(quote));
  quoteLi.querySelector(".btn-danger").addEventListener("click", () => handleDeleteClick(quote));
  quoteLi.querySelector(".btn-edit").addEventListener("click", (e) => {
    const editForm = quoteLi.querySelector("#edit-form");
    const editQuote = quoteLi.querySelector("#edit-quote");
    const editAuthor = quoteLi.querySelector("#edit-author");
    if (editForm.style.display === "none") {
      editForm.style.display = "block";
      editQuote.value = quote.quote;
      editAuthor.value = quote.author;
      const id = quote.id;
      editForm.addEventListener("submit", e => handleEditSubmit(e, id))
    }
    else
      editForm.style.display = "none";
  });
}

//Submit edited quote
function handleEditSubmit(e, id) {
  const editedQuote = e.target["edit-quote"].value;
  const editedAuthor = e.target["edit-author"].value;

  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      quote: editedQuote,
      author: editedAuthor
    })
  })
    .then(res => res.json())
    .then(() => {
      quoteList.innerHTML = "";
      fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then(quotes => renderQuotes(quotes))
    })
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

//Like quote
function handleLikeClick(quote) {
  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      quoteId: Number(quote.id),
      createdAt: Date.now()
    })
  })
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