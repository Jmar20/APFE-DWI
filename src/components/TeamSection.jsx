import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import { LinkedIn, GitHub } from "@mui/icons-material";

const TeamSection = () => {
  const theme = useTheme();

  // Datos del equipo
  const teamData = [
    {
      name: "Marcos Gamero",
      role: "CEO & Fundador",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQEjuRgUNTj_4Q/profile-displayphoto-shrink_400_400/B56ZYBnRr1GsAg-/0/1743783795924?e=1756944000&v=beta&t=oubMY2iVRbxR0Ew0MRWGn3faumvmpT5NEoH4gQ_PQSo",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Luis Trujillo",
      role: "CTO",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQFlSg_C5KST8g/profile-displayphoto-shrink_400_400/B4EZYBojXXHgAg-/0/1743784130772?e=1756944000&v=beta&t=DPZaecFIitiROgKrZK-TVJKlf64LQMx-gmAm168fDgk",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Cesar Torres",
      role: "Head of Product",
      image:
        "https://media.licdn.com/dms/image/v2/D4E35AQGMcemfUBmKXw/profile-framedphoto-shrink_800_800/B4EZXzxJgQHcAo-/0/1743551502730?e=1751763600&v=beta&t=C1Qds-aEahlczlOSz_ELWeiyhwh1-bHtbeEwm1tvcnQ",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Jesús Alonso",
      role: "Lead Developer",
      image:
        "https://i.ibb.co/1t76PNLH/Imagen-de-Whats-App-2025-06-28-a-las-20-50-33-a754a68e.jpg",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Yael Ramos",
      role: "UX/UI Designer",
      image:
        "https://i.ibb.co/W4ckfPBv/Imagen-de-Whats-App-2025-06-28-a-las-20-59-28-fab64393.jpg",
      linkedin: "#",
      github: "#",
    },
  ];

  return (
    <Box
      sx={{
        pt: { xs: 4, md: 6 }, // Menos padding superior
        pb: { xs: 8, md: 12 }, // Mantener padding inferior normal
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 8,
            xl: 3,
          },
        }}
      >
        {/* Título de la sección */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Nuestro Equipo
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Conoce a las personas apasionadas que hacen posible la
            transformación digital del agro peruano
          </Typography>
        </Box>

        {/* Grid del equipo */}
        <Grid container spacing={4} justifyContent="center">
          {teamData.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      border: `3px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2,
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Button
                      size="small"
                      href={member.linkedin}
                      sx={{ minWidth: "auto", p: 1 }}
                    >
                      <LinkedIn sx={{ fontSize: 20 }} />
                    </Button>
                    <Button
                      size="small"
                      href={member.github}
                      sx={{ minWidth: "auto", p: 1 }}
                    >
                      <GitHub sx={{ fontSize: 20 }} />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
