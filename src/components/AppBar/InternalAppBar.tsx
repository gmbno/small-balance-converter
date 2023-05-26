import { AppBar, Box, Button, Toolbar, } from "@mui/material";
import { useState } from "react";

import { ConnectionDrawer } from "../ConnectionDrawer/ConnectionDrawer.tsx";

export const InternalAppBar = () => {
    //const { activate, deactivate } = useWeb3React();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position={"fixed"}>
                <Toolbar sx={{ justifyContent: "flex-end" }}>
                    <Button variant={"contained"} onClick={() => setIsDrawerOpen(true)}>Connect</Button>
                    {/*<Button variant={"contained"} onClick={deactivate}>Disconnect</Button>*/}
                    <ConnectionDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
