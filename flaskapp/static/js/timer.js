function updateTimer() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  // Calculate remaining time until 00:00:00
  var remainingHours = 24 - hours - 1;
  var remainingMinutes = 59 - minutes;
  var remainingSeconds = 59 - seconds;

  // Pad single digits with a leading zero
  remainingHours = remainingHours < 10 ? "0" + remainingHours : remainingHours;
  remainingMinutes =
    remainingMinutes < 10 ? "0" + remainingMinutes : remainingMinutes;
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  // Update the timer element
  var timer = document.getElementById("timer");
  timer.innerHTML =
    remainingHours + ":" + remainingMinutes + ":" + remainingSeconds;
}

window.onload = function () {
  // Update the timer every second
  setInterval(updateTimer, 1000);
};
