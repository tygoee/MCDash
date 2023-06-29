import {Box, Button, CircularProgress, Stack, Tooltip, Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import {Download, Error, Warning} from "@mui/icons-material";
import {request} from "@/common/utils/RequestUtil.js";
import {PluginsContext} from "@/states/Root/pages/Plugins/contexts/Plugins";

export const StoreItem = ({id, name, description, icon, downloads, closeStore, installed}) => {
    const {updatePlugins} = useContext(PluginsContext);
    const [installing, setInstalling] = useState(false);
    const [error, setError] = useState(false);
    const [alreadyInstalled, setAlreadyInstalled] = useState(installed);

    const install = () => {
        setInstalling(true);
        request("store/?id=" + id, "PUT", {}, {}, false).then((r) => {
            setInstalling(false);

            if (r.status === 409) return setAlreadyInstalled(true);
            if (!r.ok) return setError(true);

            updatePlugins();
            closeStore();
        });
    }

    return (
        <Box backgroundColor="background.darker" borderRadius={2} padding={2} sx={{mr: 1, mt: 1, width: {xs: "100%", lg: 300}}}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <Typography variant="h6" fontWeight={500}>{name}</Typography>
                <Box component="img" sx={{width: 40, height: 40, borderRadius: 50}}
                     src={"https://spigotmc.org/" + icon}/>
            </Box>

            <Typography variant="body1">{description || "No description provided"}</Typography>

            <Stack direction="row" justifyContent="space-between" sx={{mt: 1}}>
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <Download color="secondary"/>
                    <Typography variant="h6" fontWeight={500}>{downloads}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    {installing && <CircularProgress size={20} color="secondary" />}
                    {error && <Tooltip title="Plugin not supported"><Warning color="error" /></Tooltip>}
                    {alreadyInstalled && <Tooltip title="Plugin already installed"><Error color="warning" /></Tooltip>}

                    <Button variant="contained" color="secondary" size="small" onClick={install}
                            disabled={installing || installed}>Install</Button>
                </Stack>
            </Stack>
        </Box>
    )
}