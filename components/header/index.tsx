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
import { getLocalStorage, removeBackslash } from '@/services/common';


interface HeaderProps {
    message?: string;
}

const pages = ['Home', 'Master', 'Contract', 'Billing', 'Logout'];

const Header: React.FC<HeaderProps> = ({ message }) => {

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [logo, setLogo] = React.useState<string | null>('');
    const router = useRouter();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string) => {

        const currentUrl = router.asPath;
        const normalizedPage = page.toLowerCase().trim();

        switch (normalizedPage) {
            case 'logout':                
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                localStorage.removeItem("appLogo");
                router.push('/');
                break;
            case 'master':                
                router.push('/master');  // Adjust the route as necessary
                break;
            case 'contract':                
                router.push('/contract');  // Adjust the route as necessary
                break;
            case 'billing':                
                router.push(`/billing`);  // Adjust the route as necessary
                break;
            case 'home':                
                router.push('/dashboard');  // Adjust the route as necessary
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

    React.useEffect(() => {

        if (getLocalStorage('appLogo')) {
            setLogo(getLocalStorage('appLogo'))
        }

        return () => {
            // Cleanup code goes here
        };
    }, [logo]);


    return (
        <header className='header'>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography variant="h6" noWrap component="a" onClick={() => gotoHome()}>

                            {(logo && logo === 'logo') && <Image src={require(`../../public/images/${logo}.svg`)} alt="Description of the image" className="responsive-img center" />}
                            {(logo && logo !== 'logo') && <Image src={require(`../../public/images/${logo}.png`)} alt="Description of the image" className="responsive-img center" />}
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