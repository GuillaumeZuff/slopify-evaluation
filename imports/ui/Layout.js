import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "./components/Menu";
import StudentEvaluations from "./components/StudentEvaluations";

const drawerWidth = 240;

const MainContent = (props) => {
  const { studentId } = props;
  if (!studentId) return null;
  return <StudentEvaluations {...props} />;
};

const Layout = () => {
  const [studentId, setStudentId] = React.useState();
  const [evaluationId, setEvaluationId] = React.useState();
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Slopify - Évaluation
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Menu
          studentId={studentId}
          setStudentId={(id) => {
            setEvaluationId(null);
            setStudentId(id);
          }}
        />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <MainContent
          studentId={studentId}
          evaluationId={evaluationId}
          setEvaluationId={setEvaluationId}
        />
      </Box>
    </Box>
  );
};

export default Layout;
