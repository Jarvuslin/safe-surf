import {useState} from "react";


const Profanity = () => {
    // state
    const [link, setLink] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [infoRetrieved, setInfoRetrieved] = useState(false);
    const [error, setError] = useState(null)

    // profanity data
    const [profanityReport, setProfanityReport] = useState({
        wordCount: null,
        profanityCount: null,
        profanityMakeup: null
    });

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
            a.remove();
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
            const response: Response = await fetch('http://localhost:5000/api/website-link', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({link})
            });

            setIsPending(false);
            setInfoRetrieved(true);
            setProfanityReport(await response.json());
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
            <h1>Search</h1>
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
                <div className="profanity">
                    <div className="profanity-report">
                        <ul>
                            <li>
                                <h2>Word Count</h2>
                                <p>{profanityReport.wordCount}</p>
                            </li>
                            <li>
                                <h2>Profanity Count</h2>
                                <p>{profanityReport.profanityCount}</p>
                            </li>
                            <li>
                                <h2>Profanity Percentage</h2>
                                <p>{profanityReport.profanityMakeup}%</p>
                            </li>
                        </ul>
                    </div>
                    <div className="profanity-buttons">
                        <button onClick={(e) => handleDownload(true, false, e)}>HTML</button>
                        <button onClick={(e) => handleDownload(false, true, e)}>IMAGE</button>
                    </div>
                </div>
            }
        </div>
    )
}


export default Profanity;