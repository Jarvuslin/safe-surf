import React, {useState} from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ContactUs = (): JSX.Element => {
    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({
        firstName: false,
        lastName: false,
        email: false,
        message: false
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);

    const useStyles = {
        title: {
            marginTop: '1rem',
        },
        field: {
            marginTop: '1rem',

        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setFieldErrors({
            firstName: false,
            lastName: false,
            email: false,
            message: false
        })
        setSent(false);
        setSending(true);
        setError(false);

        if (!fieldValues.firstName) {
            setFieldErrors({
                firstName: true
            });
        }
        if (!fieldValues.lastName) {
            setFieldErrors({
                lastName: true
            });
        }
        if (!fieldValues.email) {
            setFieldErrors({
                email: true
            });
        }
        if (!fieldValues.message) {
            setFieldErrors({
                message: true
            });
        }

        setError(true);

        if (fieldValues.firstName && fieldValues.lastName && fieldValues.email && fieldValues.message) {
            await fetch('http://localhost:3500/api/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: fieldValues.firstName,
                    lastName: fieldValues.lastName,
                    email: fieldValues.email,
                    message: fieldValues.message
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
                    onChange={(e) => setFieldValues({...fieldValues, firstName: e.target.value})}
                    id="filled-basic"
                    label="FIRST NAME"
                    variant="filled"
                    required
                    error={fieldErrors.firstName}
                    sx={{width: `calc(50% - 0.3rem)`, marginTop: 1, marginRight: '0.3rem'}}
                />
                <TextField
                    onChange={(e) => setFieldValues({...fieldValues, lastName: e.target.value})}
                    id="filled-basic"
                    label="LAST NAME"
                    variant="filled"
                    required
                    error={fieldErrors.lastName}
                    sx={{width: `calc(50% - 0.3rem)`, marginTop: 1, marginLeft: '0.3rem'}}
                />
                <TextField
                    onChange={(e) => setFieldValues({...fieldValues, email: e.target.value})}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="EMAIL"
                    variant="filled"
                    fullWidth
                    required
                    error={fieldErrors.email}
                />
                <TextField
                    onChange={(e) => setFieldValues({...fieldValues, message: e.target.value})}
                    sx={useStyles.field}
                    id="filled-basic"
                    label="MESSAGE"
                    variant="filled"
                    multiline
                    rows={8}
                    fullWidth
                    required
                    error={fieldErrors.message}
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