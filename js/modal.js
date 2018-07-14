// Модальное окно

var modal = document.getElementById('myModal');
var close = document.getElementsByClassName("close")[0];

close.onclick = function() {
  modal.style.display = "none"
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}