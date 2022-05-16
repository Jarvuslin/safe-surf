import {useState} from "react";
import { useNavigate } from 'react-router-dom';


const ContactUs = () => {
    const [contactData, setContactData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        setIsPending(true);
    }

    return (
        <div className="contact-form">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="text"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                />
                <label>Message</label>
                <input
                    type="text"
                    required
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                />
                {!isPending && <button>Send</button>}
                {isPending && <button disabled>Sending info</button>}
            </form>
            <p>Email: {contactData.email}</p>
            <p>Message: {contactData.message}</p>
        </div>
    )
}

export default ContactUs;