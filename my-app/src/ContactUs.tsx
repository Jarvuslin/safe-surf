import React, {useState} from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ContactUs = () => {
    // contact form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setDetails] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [error, setError] = useState(false);

    const useStyles = {
        title: {
            marginTop: '1rem',
        },
        field: {
            marginTop: '1rem',

        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSent(false);
        setSending(true);
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setMessageError(false);
        setError(false);

        if (!firstName) {
            setFirstNameError(true);
        }
        if (!lastName) {
            setLastNameError(true);
        }
        if (!email) {
            setEmailError(true);
        }
        if (!message) {
            setMessageError(true);
        }

        setError(true);

        if (firstName && lastName && email && message) {
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

            setError(false);
            setSent(true);
        }
        setSending(false);
    };

    return (
        <Container>
            <Typography
                sx={useStyles.title}
                variant='h6'
                color='textPrimary'
                align='center'
                gutterBottom
            >
                REACH OUT TO US
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    onChange={(e) => setFirstName(e.target.value)}
                    id="filled-basic"
                    label="FIRST NAME"
                    variant="filled"
                    required
                    error={firstNameError}
                    sx={{width: `calc(50% - 0.3rem)`, marginTop: 1, marginRight: '0.3rem'}}
                />
                <TextField
                    onChange={(e) => setLastName(e.target.value)}
                    id="filled-basic"
                    label="LAST NAME"
                    variant="filled"
                    required
                    error={lastNameError}
                    sx={{width: `calc(50% - 0.3rem)`, marginTop: 1, marginLeft: '0.3rem'}}
                />
                <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="EMAIL"
                    variant="filled"
                    fullWidth
                    required
                    error={emailError}
                />
                <TextField
                    onChange={(e) => setDetails(e.target.value)}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="MESSAGE"
                    variant="filled"
                    multiline
                    rows={8}
                    fullWidth
                    required
                    error={messageError}
                />
                <LoadingButton
                    type="submit"
                    sx={{marginTop: '1rem'}}
                    color={error ? 'error' : 'primary'}
                    variant="contained"
                    fullWidth
                    endIcon={<KeyboardArrowRightIcon/>}
                    loading={sending}
                >
                    {sending ? 'Sending...' : 'Send'}
                </LoadingButton>
                {sent && <Typography sx={useStyles.title}
                                     variant='subtitle1'
                                     color='textPrimary'
                                     gutterBottom
                >
                    {`Thank you for your response, you can expect to hear back from us within 48 hours.`.toUpperCase()}
                </Typography>}
                {error && <Typography sx={useStyles.title}
                                      variant='subtitle1'
                                      color='error'
                                      gutterBottom
                >
                    {'Please fill out the entirety of the form.'.toUpperCase()}
                </Typography>}
            </form>
        </Container>
    );
}

export default ContactUs;