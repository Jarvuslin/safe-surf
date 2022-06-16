import * as React from 'react';
import {useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";

const Profanity = (): JSX.Element => {
    const [uuid, setUuid] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [isPending, setIsPending] = useState<boolean>(false);
    const [infoRetrieved, setInfoRetrieved] = useState<boolean>(false);
    const [timestamp, setTimestamp] = useState<string>('');
    const [error, setError] = useState<string>('')
    const [profanityReport, setProfanityReport] = useState<{ [key: string]: number }>({
        wordCount: 0,
        profanityCount: 0,
        profanityMakeup: 0
    });

    const useStyles = {
        title: {
            marginTop: '1rem',
        },
        field: {
            marginTop: 2,
            marginBottom: 2,
            display: 'block'
        },
        paper: {
            paddingTop: 1,
            paddingBottom: 1
        }
    };

    const handleDownload = async (html: boolean, img: boolean, e: { preventDefault: () => void; }): Promise<void> => {
        e.preventDefault();

        try {
            const response: Response = await fetch('https://2c94-99-246-201-45.ngrok.io/api/profanity-download', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    link: {link},
                    html: html,
                    img: img,
                    uuid: uuid
                })
            });

            const data: Blob = await response.blob();
            const href: string = URL.createObjectURL(data);

            const a: HTMLAnchorElement = document.createElement("a");

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


    const handleSubmit = async (e: { preventDefault: () => void; }): Promise<void> => {
        e.preventDefault();

        setInfoRetrieved(false);
        setIsPending(true);
        setTimestamp('')

        const start: Date = new Date();

        if (link.length === 0) {
            setError('PLEASE ENTER A LINK');
            setIsPending(false);
            return;
        }

        try {
            const response: Response = await fetch('https://2c94-99-246-201-45.ngrok.io/api/link-validity', {
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

        const fileName: string = uuidv4();
        setUuid(fileName);

        try {
            const response: Response = await fetch('https://2c94-99-246-201-45.ngrok.io/api/website-link', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({link, fileName})
            });

            const end: Date = new Date();

            setTimestamp(`${Math.round((end.getTime() - start.getTime()) / 1000 * 100) / 100}`);
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
                            <ul id='profanity-data' style={{paddingBottom: 0}}>
                                <li>
                                    <Paper elevation={12} sx={useStyles.paper}>
                                        <Typography>TOTAL WORDS</Typography>
                                        <Typography>{profanityReport.wordCount}</Typography>
                                    </Paper>
                                </li>
                                <li>
                                    <Paper elevation={12} sx={useStyles.paper}>
                                        <Typography>PROFANE WORDS</Typography>
                                        <Typography>{profanityReport.profanityCount}</Typography>
                                    </Paper>
                                </li>
                                <li>
                                    <Paper elevation={12} sx={useStyles.paper}>
                                        <Typography>PROFANITY MAKEUP</Typography>
                                        <Typography>{`${profanityReport.profanityMakeup}%`}</Typography>
                                    </Paper>
                                </li>
                            </ul>
                            <Typography align='center' gutterBottom sx={{color: "LightGray"}}>
                                {`Generated in ${timestamp} seconds`}
                            </Typography>
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