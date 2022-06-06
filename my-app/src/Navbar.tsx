import React, {Dispatch, SetStateAction} from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import PolicyIcon from '@mui/icons-material/Policy';
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";

const pages: string[] = ['FILTER', 'ABOUT US', 'CONTACT US'];

const useStyles = {
    menu: {
        textDecoration: 'none',
        color: 'inherit',
        marginTop: 8,
        marginBottom: 6,
        marginRight: 15,
        marginLeft: 15,
        display: 'block'
    }
}

const Navbar = ({darkMode, setDarkMode}: {darkMode: boolean, setDarkMode: Dispatch<SetStateAction<boolean>>}): JSX.Element => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (): void => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to={'/'} style={{display: 'flex', color: 'inherit', textDecoration: 'inherit'}}>
                        <PolicyIcon sx={{marginTop: '4px', display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'Akshar',
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                margin: 0
                            }}
                        >
                            SAFESURF
                        </Typography>
                    </Link>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <Link key={page} style={{...useStyles.menu, textAlign: 'center'}} to={`/${page.toLowerCase().replace(/\s/g, '-')}`}>
                                    {page}
                                </Link>
                            ))}
                            <IconButton sx={{ml: 1, display: 'block', marginLeft: 'auto', marginRight: 'auto', padding: 1, paddingBottom: 0.4}}
                                        onClick={() => setDarkMode(!darkMode)} color="inherit">
                                {darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                            </IconButton>
                        </Menu>
                    </Box>
                    <Link to={'/'}
                          style={{display: 'flex', flexGrow: '1', color: 'inherit', textDecoration: 'inherit'}}>
                        <PolicyIcon
                            sx={{marginLeft: '66px', marginTop: '4px', display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                fontFamily: 'Akshar',
                                letterSpacing: '.1rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                marginRight: '1px'
                            }}
                        >
                            SAFESURF
                        </Typography>
                    </Link>
                    <Box sx={{marginLeft: 'auto', display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Link key={page} style={{textDecoration: 'none'}} to={`/${page.toLowerCase().replace(/\s/g, '-')}`}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                        <Box
                            sx={{
                                display: 'flex',
                                width: '5px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 1.4,
                                marginRight: 1.4,
                            }}
                        >
                        <IconButton sx={{ml: 1}} onClick={() => setDarkMode(!darkMode)} color="inherit">
                            {darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                        </IconButton>
                        </Box>
                    </Box>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        sx={{
                            display: {xs: 'flex', md: 'none'},
                            mr: 2,
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
