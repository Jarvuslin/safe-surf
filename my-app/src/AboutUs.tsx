import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import {Link} from "react-router-dom";

const AboutUs = () => {
    const useStyles = {
        title: {
            marginTop: '1rem',
        }
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
                ABOUT US
            </Typography>
            <Typography>
                Computer science project created by two high school students.
            </Typography>
            <Link to={'/contact-us'}>
            <Typography>
                If you would like to reach out, click here.
            </Typography>
            </Link>
</Container>
    );
}

export default AboutUs;