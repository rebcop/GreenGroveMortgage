function displayMessage() {
    // get the text out of our <input> and assign it to a variable
    let msg = document.getElementById('message').value;

    Swal.fire(
        {
            backdrop: false,
            title: 'Green Grove Mortgage',
            text: msg, // <-- replace this text with that variable
        }
    );
}