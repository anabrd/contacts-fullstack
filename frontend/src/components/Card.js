// TODO:
// revert to previous state if user cancels
// Display success and error messages on top

import { useState } from 'react';
import { FiEdit, FiSave, FiTrash2, FiX } from "react-icons/fi";

function Card({contact, deleteContact, message, setMessage}) {
    const [isEditable, setIsEditable] = useState(false);
    const [bgColor, setBgColor] = useState("white");
    const editedContact = {...contact};
    const [contactInfo, setContactInfo] = useState(contact);
    const [imgPath, setImgPath] = useState(contact.contactPic);

    const editToggle = () => {
        setIsEditable(!isEditable);
        if (isEditable) {
            setContactInfo(contact);
        }
        // this logic is opposite because setState is async
        setBgColor(isEditable ? "white" : "#0a92a4");
    }

    const editCardHandler = (e) => {
        const id = e.target.getAttribute("data-id");
        console.log(e.target.getAttribute("data-id"))
        let info;
        if (id == "contactPic") {
            info = e.target.files[0];
        } else {
            info = e.target.innerText;
        }
        editedContact[id] = info;
        const newContact = {...contactInfo};
        newContact[id] = info;
        setContactInfo(newContact);
    }

    const editCheckHandler = (e) => {
        console.log(e)
        if (e.charCode == 13) {
            e.preventDefault();
            updateContactHandler();
        }
    }

    const updateContactHandler = () => {

        const formData = new FormData();
        formData.append('_id', contactInfo._id);
        formData.append('contactPic', contactInfo.contactPic);
        formData.append('fullName', contactInfo.fullName);
        formData.append('email', contactInfo.email);
        formData.append('phone', contactInfo.phone);
        formData.append('address', contactInfo.address);

        console.log(contactInfo)

        const url = '/contacts/update';
        const options = {
        method: 'POST',
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        body: formData
        }

        fetch(url, options)
        .then(data => data.json().then(output => {
            if (output.status === "success") {
                setIsEditable(false);
                setMessage(output.message);
                setBgColor("white");
                let newPath = output.data.contactPic;
                setImgPath(newPath);
                setTimeout(()=> setMessage(null), 3000);
            } else {
                setBgColor("coral");
            }
        }))
        .catch(err => setBgColor("coral"));
    }

    return (
        <div className={message ? "card card-animate" : "card"} style={{backgroundColor: bgColor}}>
            {isEditable ? <input type="file" data-id="contactPic" onChange={editCardHandler}/> : <div 
            className="image" style={{backgroundImage: `frontend/build/static/media${imgPath})`, backgroundSize: "cover"}}></div>}
            <section className="card-content">
                <div 
                data-id="fullName"
                onKeyPress={editCheckHandler}
                onBlur={editCardHandler}
                contentEditable={isEditable}
                style={isEditable? {border: "1px solid grey"} : {border: "none"}}
                >
                    {contactInfo.fullName}
                </div>
                <div 
                data-id="email"
                onKeyPress={editCheckHandler}
                onBlur={editCardHandler}
                contentEditable={isEditable}
                style={isEditable? {border: "1px solid grey"} : {border: "none"}}
                >
                    {contactInfo.email}
                </div>
                <div 
                data-id="phone"
                onKeyPress={editCheckHandler}
                onBlur={editCardHandler}
                contentEditable={isEditable}
                style={isEditable? {border: "1px solid grey"} : {border: "none"}}
                >
                    {contactInfo.phone}
                </div>
                <div 
                data-id="address"
                onKeyPress={editCheckHandler}
                onBlur={editCardHandler}
                contentEditable={isEditable}
                style={isEditable? {border: "1px solid grey"} : {border: "none"}}>
                    {contactInfo.address}
                </div>
            </section>
            <section className="buttons-wrapper">
                {isEditable ? <FiX onClick={editToggle} style={{color: "white"}}/> : <FiEdit onClick={editToggle} />}
                {isEditable ? <FiSave onClick={updateContactHandler} style={{color: "white"}}/> : null}
                <FiTrash2 onClick={deleteContact} style={isEditable ? {color: "white"} : {color: "#0a92a4"}}/>
            </section>
        
    </div>
    )
}

export default Card;
