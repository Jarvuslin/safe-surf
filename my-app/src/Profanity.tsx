import {useState} from "react";


const Create = () => {
    const [link, setLink] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [infoRetrieved, setInfoRetrieved] = useState(false);
    const [error, setError] = useState(null)


    const handleDownload = async (html: boolean, img: boolean, e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/profanity-download', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    link: {link},
                    html: html,
                    img: img,
                })
            });

            const data = await response.blob();
            const href = URL.createObjectURL(data);

            const a = document.createElement("a");

            if (html){
                a.download = 'clone.mhtml'
            } else if (img) {
                a.download = 'screenshot.png'
            }

            a.href = href;

            document.body.appendChild(a);
            a.click();
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted.');
                return;
            }
        }
    };


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        setInfoRetrieved(false);
        setIsPending(true);

        try {
            await fetch('http://localhost:5000/api/website-link', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({link})
            });

            setIsPending(false);
            setInfoRetrieved(true);
            setError(null);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted.');
                return;
            }
            setError(error.message);
            setIsPending(false);
        }
    }

    return (
        <div className="submit-form">
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
            {infoRetrieved &&
                <div className="profanity-data">
                    <h1>Profanity Report</h1>
                    <button onClick={(e) => handleDownload(true, false, e)}>HTML</button>
                    <button onClick={(e) => handleDownload(false, true, e)}>IMAGE</button>
                </div>
            }
        </div>
    )
}


export default Create;