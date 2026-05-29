function switchTab(tab, btn) {
  // Hide all content panels
  document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
  // Remove active from all buttons
  document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'));
  // Show selected panel and mark button active
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
  // Close mobile menu if open
  document.querySelector('.nav-tabs').classList.remove('open');
}

function toggleMenu() {
  document.querySelector('.nav-tabs').classList.toggle('open');
}
