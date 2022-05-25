import React from 'react'
import Typography from '@mui/material/Typography';

const Home = () => {
    const useStyles = {
        title: {
            marginTop: '1rem',
        }
    };

    return (
        <div className="home">
            <Typography
                sx={useStyles.title}
                variant='h6'
                color='textPrimary'
                align='center'
                gutterBottom
            >
                HOME
            </Typography>
        </div>
    );
}

export default Home;