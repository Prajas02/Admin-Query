// preventing form of submitting data on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

//resizing my text area based on content
document.getElementById("describe").addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

// making the function
function showMessage(elem_id, messageTitle, messageBody) {
    document.getElementById('messageTitle').innerText = messageTitle;
    document.getElementById('messageBody').innerText = messageBody;
    elem_id.classList.add('active')
}

// submit popup for home-query page
const submitPopup = document.getElementById('submitPopup')
const submit = document.getElementById('submit')
submit.addEventListener('click', () => {

    var fname = document.getElementById('fname').value
    var lname = document.getElementById('lname').value
    var email = document.getElementById('email').value
    var rnum = document.getElementById('rnum').value
    var describe = document.getElementById('describe').value

    if (fname == "" || lname == "" || email == "" || rnum == "" || describe == "") {
        showMessage(submitPopup, "Incomplete Form", "Please fill all the required fields.")
    }
    else {
        $.ajax({
            url: '/query',
            type: 'POST',
            data: {
                'fname': fname,
                'lname': lname,
                'email': email,
                'rnum': rnum,
                'describe': describe
            },
            success: function () {
                showMessage(submitPopup, "Thank You For Filling The Form", "We will get back to you as soon as we solve your query.");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        })
    }

})

// deleting record
function deleteRow(event) {
    if (event.target.classList.contains('deleteBtn')) {  // get the id
        var table = document.getElementById('table')
        var rowvalue = event.target.closest('tr').rowIndex;
        var value = table.rows[rowvalue].cells[0].innerText;
    }
    $.ajax({
        url: '/delete',
        type: 'POST',
        data: { 'value': value },
        success: function () {
            window.location.reload()
        }
    });
}

// resolve popup for admin page

function resolvePrompt(event) {
    const resolvePopup = document.getElementById('resolvePopup')
    resolvePopup.classList.add('active')

    // removing the class if clicked
    document.getElementById('rescloseBtn').addEventListener('click' , ()=>{
        resolvePopup.classList.remove('active')
    })

    if (event.target.classList.contains('resolveBtn')) {
        var table = document.getElementById('table')
        var rowvalue = event.target.closest('tr').rowIndex;
        var value = table.rows[rowvalue].cells[0].innerText;
        var email = table.rows[rowvalue].cells[5].innerText;
    }
    // submit the message to server
    const submitResMsg = document.getElementById('submitResMsg')
    submitResMsg.addEventListener('click', () => {
        var message = document.getElementById('resMsg').value;

        $.ajax({
            url: '/resolveMessage',
            type: 'POST',
            data: {
                'message': message,
                'value': value,
                'email': email
            },
            success: function () {
                window.location.reload()
            }
        })
    })
}


