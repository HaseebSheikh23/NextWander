(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


 
document.querySelectorAll('.filter').forEach(filterElement => {
  filterElement.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor tag behavior
    console.log('Filter clicked');    
    const category = this.querySelector('p').textContent;
    window.location.href = `/listings?category=${encodeURIComponent(category)}`;
  });
});
  

  // Inside the chatForm 'submit' event listener

