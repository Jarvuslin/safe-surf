import {useState} from "react";
import { useNavigate } from 'react-router-dom';


const Create = () => {
    const [link, setLink] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null)

    const navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const profanityInfo = {link};

        setIsPending(true);

        fetch('http://localhost:5000/api/profanity', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profanityInfo)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to POST!');
                }
                return res.json();
            })
            .then(response => {
                setIsPending(false);

                response.file().then((file: Blob | MediaSource) => {
                    let url = window.URL.createObjectURL(file);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'employees.json';
                    a.click();
                });
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted.');
                    return;
                }
                setError(err.message);
                setIsPending(false);
            });
    }

    return (
        <div className="profanity">
            <h2>Profanity Filter</h2>
            <form onSubmit={handleSubmit}>
                <label>Link:</label>
                <input
                    type="text"
                    required
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                {!isPending && <button>Submit</button>}
                {isPending && <button disabled>Fetching Info...</button>}
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default Create;