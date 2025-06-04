import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Person,
  EditNote,
  Logout,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import type { HeaderProps } from "../types";

const Header: React.FC<HeaderProps> = ({ variant = "home", onProfileEdit }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setMobileDrawerOpen(true);
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMobileDrawerOpen(false);
  };

  const handleMenuItemClick = async (action: string) => {
    handleMenuClose();

    switch (action) {
      case "home":
        navigate("/");
        break;
      case "profile":
        if (variant === "profile" && onProfileEdit) {
          onProfileEdit("view");
        } else {
          navigate("/profile");
        }
        break;
      case "edit":
        if (variant === "profile" && onProfileEdit) {
          onProfileEdit("edit");
        } else {
          navigate("/profile", { state: { editMode: true } });
        }
        break;
      case "logout":
        await logout();
        navigate("/login");
        break;
    }
  };

  const menuItems = [
    { action: "home", icon: <Home />, text: "Home" },
    { action: "profile", icon: <Person />, text: "My Profile" },
    { action: "edit", icon: <EditNote />, text: "Edit Profile" },
    { action: "logout", icon: <Logout />, text: "Logout" },
  ];

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          display: "flex",
          justifyContent: variant === "login" ? "flex-start" : "space-between",
          alignItems: "center",
          p: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <Box
          component="button"
          onClick={() => navigate("/")}
          sx={{
            padding: { xs: "6px 12px", sm: "8px 16px" },
            border: "2px solid #333333",
            borderRadius: 1,
            color: "#000000",
            fontWeight: "bold",
            fontSize: { xs: "12px", sm: "14px" },
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
            "&:focus": {
              outline: "2px solid #4A90E2",
              outlineOffset: "2px",
            },
          }}
          aria-label="ProfileHub - Go to home"
        >
          ProfileHub
        </Box>

        {/* Menu Button */}
        {variant !== "login" && (
          <IconButton
            onClick={handleMenuClick}
            sx={{
              color: "#333333",
              padding: { xs: 1.5, sm: 2 },
            }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop Menu */}
        {!isMobile && (
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                minWidth: 200,
              },
            }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.action}
                onClick={() => handleMenuItemClick(item.action)}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        )}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={handleMenuClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Menu
          </Typography>
          <IconButton onClick={handleMenuClose} aria-label="Close menu">
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.action} disablePadding>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.action)}
                sx={{
                  py: 2,
                  "&:hover": {
                    backgroundColor: "rgba(74, 144, 226, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.action === "logout" ? "error.main" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: item.action === "logout" ? "error.main" : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ height: { xs: 56, sm: 64 } }} />
    </>
  );
};

export default Header;
