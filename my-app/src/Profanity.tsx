import * as React from 'react';
import {useState} from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";

const Profanity = () => {
    // state
    const [link, setLink] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [infoRetrieved, setInfoRetrieved] = useState(false);
    const [error, setError] = useState('')
    // profanity data
    const [profanityReport, setProfanityReport] = useState({
        wordCount: null,
        profanityCount: null,
        profanityMakeup: null
    });

    const useStyles = {
        title: {
            marginTop: '1rem',
        },
        field: {
            marginTop: 2,
            marginBottom: 2,
            display: 'block'
        }
    };

    const handleDownload = async (html: boolean, img: boolean, e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3500/api/profanity-download', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    link: {link},
                    html: html,
                    img: img,
                })
            });

            const data = await response.blob();
            const href = URL.createObjectURL(data);

            const a = document.createElement("a");

            if (html) {
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

        if (link.length === 0) {
            setError('PLEASE ENTER A LINK');
            setIsPending(false);
            return;
        }

        try {
            console.log('submitting 2');
            const response: Response = await fetch('http://localhost:3500/api/link-validity', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({link})
            });

            const {status} = await response.json();

            if (status === 404) {
                setError('WEBPAGE DOES NOT EXIST');
                setIsPending(false);
                return;
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted.');
                return;
            }
            setError(error.message);
            setIsPending(false);
        }

        setError('');

        try {
            console.log('submitting 2');
            const response: Response = await fetch('http://localhost:3500/api/website-link', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({link})
            });

            setIsPending(false);
            setInfoRetrieved(true);
            setProfanityReport(await response.json());
            setError('');
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
        <Container>
            <Typography
                sx={useStyles.title}
                variant='h6'
                component='h2'
                color='textPrimary'
                align='center'
                gutterBottom
            >
                PROFANITY FILTER
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    onChange={(e) => setLink(e.target.value)}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="WEBSITE LINK"
                    variant="filled"
                    error={!!error}
                    fullWidth
                />
                <LoadingButton
                    type="submit"
                    color={error ? 'error' : 'primary'}
                    variant="contained"
                    fullWidth
                    endIcon={<KeyboardArrowRightIcon/>}
                    loading={isPending}
                >
                    {isPending ? 'Sending...' : 'Send'}
                </LoadingButton>

                {error && <Typography sx={useStyles.title}
                                      variant='subtitle1'
                                      color='error'
                                      gutterBottom
                >
                    {error}
                </Typography>}
            </form>
            {infoRetrieved &&
                <div className="profanity" style={{marginTop: 10}}>
                    <div className="profanity-report">
                        <Paper elevation={3}>
                            <Typography
                                sx={{...useStyles.title, paddingTop: 2}}
                                variant='h6'
                                component='h2'
                                color='textPrimary'
                                align='center'
                                gutterBottom
                            >
                                REPORT
                            </Typography>
                            <ul id='profanity-data'>
                                <li>
                                    <Paper elevation={12}>
                                        <Typography>WORD COUNT</Typography>
                                        <Typography>{profanityReport.wordCount}</Typography>
                                    </Paper>
                                </li>
                                <li>
                                    <Paper elevation={12}>
                                        <Typography>PROFANITY COUNT</Typography>
                                        <Typography>{profanityReport.profanityCount}</Typography>
                                    </Paper>
                                </li>
                                <li>
                                    <Paper elevation={12}>
                                        <Typography>PROFANITY %</Typography>
                                        <Typography>{profanityReport.profanityMakeup}</Typography>
                                    </Paper>
                                </li>
                            </ul>
                        </Paper>
                    </div>
                    <div className="profanity-buttons">
                        <Button
                            sx={{width: `calc(50% - 0.3rem)`, marginRight: '0.3rem'}}
                            onClick={(e) => handleDownload(true, false, e)}
                            variant="contained"
                        >
                            HTML
                        </Button>
                        <Button
                            sx={{width: `calc(50% - 0.3rem)`, marginLeft: '0.3rem'}}
                            onClick={(e) => handleDownload(false, true, e)}
                            variant="contained"
                        >
                            IMAGE
                        </Button>
                    </div>
                </div>
            }
        </Container>
    )
}


export default Profanity;