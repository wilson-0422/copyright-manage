document.addEventListener('DOMContentLoaded', function() {
  var deleteForms = document.querySelectorAll('form[onsubmit]');
  deleteForms.forEach(function(form) {
    var originalOnsubmit = form.getAttribute('onsubmit');
    if (originalOnsubmit && originalOnsubmit.indexOf('confirm') !== -1) {
      form.removeAttribute('onsubmit');
      form.addEventListener('submit', function(e) {
        if (!confirm('确定要执行此操作吗？此操作不可撤销。')) {
          e.preventDefault();
        }
      });
    }
  });

  var revenueShareInput = document.getElementById('revenue_share');
  if (revenueShareInput) {
    revenueShareInput.addEventListener('input', function() {
      var val = parseFloat(this.value);
      if (val < 0) this.value = 0;
      if (val > 1) this.value = 1;
    });
  }

  var startDateInput = document.getElementById('start_date');
  var endDateInput = document.getElementById('end_date');
  if (startDateInput && endDateInput) {
    startDateInput.addEventListener('change', function() {
      if (endDateInput.value && endDateInput.value < this.value) {
        endDateInput.value = this.value;
      }
      endDateInput.min = this.value;
    });
  }

  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link) {
    if (link.getAttribute('href') === currentPath) {
      link.style.background = 'rgba(255,255,255,0.15)';
    }
    if (currentPath.startsWith(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
      link.style.background = 'rgba(255,255,255,0.1)';
    }
  });
});
