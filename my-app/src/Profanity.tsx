import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";

const Home = () => {
    const navigate = useNavigate();

    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const handleClick = () => {
        fetch('http://localhost:5000/api/profanity/', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                link: 'testing'
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw Error('Failed to fetch profanity data.')
                }
                return res.json()
            })
            .then((data) => {
                console.log(data)

                setData(data);
                setIsPending(false);
                setError(null);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted.');
                    return;
                }
                setError(err.message);
                setIsPending(false);
            });
        return ''
    }

    return (
        <div className="profanity-data">
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {data && (
                <article>
                    <h1>Response</h1>
                </article>
            )}
            <button onClick={() => {
                handleClick()
                setIsPending(true)
            }}>Fetch</button>
        </div>
    );
}

export default Home;