import React, {useState} from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ContactUs = () => {
    const [email, setEmail] = useState('');
    const [message, setDetails] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [detailsError, setDetailsError] = useState(false);
    const [error, setError] = useState(false);

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


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSent(false);
        setSending(true);
        setTitleError(false);
        setDetailsError(false);
        setError(false);

        if (!email) {
            setTitleError(true);
            setError(true);
        }
        if (!message) {
            setDetailsError(true);
            setError(true);
        }

        if (email && message) {
            console.log(`email: ${email} | message ${message}`);

            await fetch('http://localhost:3500/api/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    message
                })
            });

            setSent(true);
        }
        setSending(false);
    };

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
                 Please fill out the following form
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    id="filled-basic"
                    label="Name"
                    variant="filled"
                    required
                    error={titleError}
                    sx={{width: `calc(50% - 0.4rem)`, marginTop: 1, marginRight: '0.4rem'}}
                />
                <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    id="filled-basic"
                    label="Name"
                    variant="filled"
                    required
                    error={titleError}
                    sx={{width: `calc(50% - 0.4rem)`, marginTop: 1, marginLeft: '0.4rem'}}
                />


                <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="Name"
                    variant="filled"
                    fullWidth
                    required
                    error={titleError}
                />
                <TextField
                    onChange={(e) => setDetails(e.target.value)}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="Message"
                    variant="filled"
                    multiline
                    rows={8}
                    fullWidth
                    required
                    error={detailsError}
                />
                <LoadingButton
                    type="submit"
                    color={error ? 'error' : 'primary'}
                    variant="contained"
                    fullWidth
                    endIcon={<KeyboardArrowRightIcon/>}
                    loading={sending}
                >
                    {sending ? 'Sending...' : 'Send'}
                </LoadingButton>
                <Typography sx={useStyles.title}
                            variant='h6'
                            component='h2'
                            color='textPrimary'
                            gutterBottom
                >
                    {sent ? `Thank you ${email}` : ''}
                </Typography>
            </form>
        </Container>
    );
}

export default ContactUs;