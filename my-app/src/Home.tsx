import React from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Home = (): JSX.Element => {
    const useStyles = {
        title: {
            marginTop: '1rem',
        }
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant='h2'>
                        EXPERIENCE THE WORLD THROUGH A CLEAN LENS
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography>
                        FILL RANDOM TEXT HERE LATER JKDFJALKSDJFKLDSAJFKLADSJFKLSDAJF DSALKFJDSALKJ FDSALKJFADS
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;