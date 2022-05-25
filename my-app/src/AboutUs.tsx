import Typography from "@mui/material/Typography";
import React from "react";

const AboutUs = () => {
    const useStyles = {
        title: {
            marginTop: '1rem',
        }
    };

    return (
        <div className="about-us">
            <Typography
                sx={useStyles.title}
                variant='h6'
                color='textPrimary'
                align='center'
                gutterBottom
            >
                ABOUT US
            </Typography>
        </div>
    );
}

export default AboutUs;