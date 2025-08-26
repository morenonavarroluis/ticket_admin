const checkboxes = document.querySelectorAll('input[type="checkbox"]');

const totalSpan = document.getElementById('total');


checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    let total = 0; 

   
    checkboxes.forEach(cb => {
    
      if (cb.checked) {
        
        total += parseInt(cb.value);
      }
    });

    
    totalSpan.textContent = total;
  });
});