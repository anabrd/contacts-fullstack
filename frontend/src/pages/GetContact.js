import './GetContact.css'

function GetContact() {


    const submitHandler = (e) => {
        e.preventDefault();

        let data = new FormData();

        data.append("fullName", e.target[0].value);
        data.append("email", e.target[1].value);
        data.append("phone", e.target[2].value);
        data.append("message", e.target[3].value);
        // data.append("message", e.target[4].files);
        
      /*   for (let i = 0 ; i < e.target[4].files.length ; i++) {
            data.append("attachs",  e.target[4].files[i]);
        }
 */
        Array.from(e.target[4].files).forEach(file => {
            data.append("attachs", file)
        })
        

        console.log("object from entries", Object.fromEntries(data));

        for (const value of data.values()) {
            console.log(value);
        }

        let url = "https://my-contacts-mern-app.herokuapp.com/get-contact"
        let options = {
            method: 'POST',
            body: data
        }

        fetch(url, options)
        .then(result => result.json()
        .then(output => {
            if (output.status == "success") {
                alert("success");
            } else {
                alert(output.message);
            }
            console.log(data)
        }));
    }

    return (
        <div id="get-contact">
            <h1>Contact us</h1>
            <form className="contact-form" onSubmit={submitHandler}>
                <input type="text" placeholder="Full Name"></input>
                <input type="email" placeholder="Email"></input>
                <input type="tel" placeholder="Phone"></input>
                <textarea placeholder="Message"></textarea>
                <input type="file" multiple></input>
                <button>Get Contact</button>
            </form>
        </div>
    )
}

export default GetContact
