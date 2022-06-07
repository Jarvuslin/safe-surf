import React from 'react'
import {Link} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const Home = (): JSX.Element => {
    const useStyles = {
        box: {
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
        }
    };

    return (
        <Container maxWidth='lg'>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Box sx={useStyles.box}>
                        <Typography variant='h1' gutterBottom sx={{fontWeight: 'bold', fontSize: '4rem'}}>
                            EXPERIENCE THE WORLD THROUGH A CLEARER LENS
                        </Typography>
                        <Link to='/filter' style={{textDecoration: 'none', listStyleType: 'none'}}>
                            <Button size='large' variant="contained">Filter Now</Button>
                        </Link>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <img src='search.png' alt='Search Image' style={{width: '100%'}}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;