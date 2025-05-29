import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Person,
  EditNote,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  variant?: "home" | "profile" | "login";
  onProfileEdit?: () => void;
}

const Header: React.FC<HeaderProps> = ({ variant = "home", onProfileEdit }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = async (action: string) => {
    handleMenuClose();
    switch (action) {
      case "home":
        navigate("/");
        break;
      case "profile":
        if (variant === "profile" && onProfileEdit) {
          // On profile page, reset to view mode
          onProfileEdit();
        } else {
          // Navigate to profile page
          navigate("/profile");
        }
        break;
      case "edit":
        if (variant === "profile" && onProfileEdit) {
          onProfileEdit();
        } else {
          navigate("/profile");
        }
        break;
      case "logout":
        await logout();
        break;
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: variant === "login" ? "flex-start" : "space-between",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          padding: "8px 16px",
          border: "2px solid #333333",
          borderRadius: 1,
          color: "#333333",
          fontWeight: "bold",
          fontSize: "14px",
          backgroundColor: "transparent",
        }}
      >
        ProfileHub
      </Box>

      {/* Hamburger Menu - Only show for non-login pages */}
      {variant !== "login" && (
        <Box>
          <IconButton onClick={handleMenuClick} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick("home")}>
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("profile")}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("edit")}>
              <ListItemIcon>
                <EditNote fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("logout")}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Header;
