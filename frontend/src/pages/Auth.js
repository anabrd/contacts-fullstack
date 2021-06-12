import {Link} from 'react-router-dom';
import { useState } from 'react';
import { useHistory } from 'react-router-dom'

export default function() {

    let history = useHistory();

    let submitHandler = (e) => {
        e.preventDefault();
        let data = {};
        data.email = e.currentTarget.children[1].value;
        data.pass = e.currentTarget.children[2].value;

        // LOGIN REQUEST
        if (e.nativeEvent.submitter.id == "login") {
            let url = '/auth/login';
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

        fetch(url, options)
        .then(result => result.json()
        .then(output => {
            if (output.status == "success") {
                alert("Congrats, you're logged in!");
                history.push("/contacts");
                // Set the token in the localStorage once you get it
                localStorage.setItem("token", output.token)
            } else {
                alert(output.message)
            }
        }
        ))
    // REGISTER REQUEST
    } else if (e.nativeEvent.submitter.id == "register") {

        e.preventDefault();
        console.log(data);
        let url = '/auth/register';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        fetch(url, options)
        .then(result => result.json()
        .then(output => {
            if (output.status == "success") {
                alert("Congrats, you're registered! You can log in.");
            } else {
                alert(output.message)
            }
        }))
    }
    }

    return(
        <div className="App">
            <form onSubmit={submitHandler} className="form auth">
                <h3>Welcome</h3>
                <input type="email" placeholder="Enter email" autoComplete="on" required/>
                <input type="password" placeholder="Password" autoComplete="on" required/>
                <div className="buttons-wrapper">
                    <input id= "login" type="submit" className="btn btn-main" value="Login" ></input>
                    <input id = "register" type="submit" className="btn btn-main" value="Register"></input>
                </div>
            </form>
        </div>
    )
}