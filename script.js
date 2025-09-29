function resetForm() 
{
    document.getElementById('registrationForm').reset();
}

document.getElementById('registrationForm').addEventListener('submit', function(event) 
{
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) 
    {
        alert('Passwords must match.');
        event.preventDefault();
    }
});