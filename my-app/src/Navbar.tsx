import * as React from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import PolicyIcon from '@mui/icons-material/Policy';

const pages = ['Search', 'About Us', 'Contact Us'];

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        console.log('run' + event.currentTarget)
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        console.log('clicked')
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
                                <Link style={{textDecoration: 'none', color: 'inherit'}}
                                      to={`/${page.toLowerCase().replace(/\s/g, '-')}`}>
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <Link to={'/'} style={{display: 'flex', flexGrow: '1' ,color: 'inherit', textDecoration: 'inherit'}}>
                        <PolicyIcon sx={{marginLeft: '66px', marginTop: '4px', display: {xs: 'flex', md: 'none'}, mr: 1}}/>
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
                            <Link style={{textDecoration: 'none'}} to={`/${page.toLowerCase().replace(/\s/g, '-')}`}>
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
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
