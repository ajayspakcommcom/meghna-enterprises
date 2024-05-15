import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Image from "next/image";
import { useRouter } from 'next/router';


interface HeaderProps {
    message?: string;
}

const pages = ['Master', 'Contract', 'Billing', 'Logout'];

const Header: React.FC<HeaderProps> = ({ message }) => {

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const router = useRouter();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string) => {

        // if (page.toLowerCase().trim() === 'logout') {
        //     console.log('Clicked page:', page);
        //     localStorage.removeItem("token");
        //     localStorage.removeItem("userData");
        //     router.push('/');
        // }

        const normalizedPage = page.toLowerCase().trim();

        switch (normalizedPage) {
            case 'logout':
                console.log('Clicked page:', page);
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                router.push('/');
                break;
            case 'master':
                console.log('Navigating to Master page');
                router.push('/master');  // Adjust the route as necessary
                break;
            case 'contract':
                console.log('Navigating to Contract page');
                router.push('/contract');  // Adjust the route as necessary
                break;
            case 'billing':
                console.log('Navigating to Billing page');
                router.push('/billing');  // Adjust the route as necessary
                break;
            default:
                // Optionally handle any cases not covered
                break;
        }


    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const gotoHome = () => {
        router.push('/dashboard');
    };


    return (
        <header className='header'>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography variant="h6" noWrap component="a" onClick={() => gotoHome()}>
                            <Image src={require('../../public/images/logo.png')} alt="Description of the image" className="responsive-img center" />
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </header>
    )
}



export default React.memo(Header);