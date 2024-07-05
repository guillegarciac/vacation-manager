'use client';

import styles from "./page.module.css";
import { Button, Card, CardContent, Typography, Grid, TextField, MenuItem, CircularProgress, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Sprint {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface Squad {
  _id: string;
  name: string;
}

interface Vacation {
  _id: string;
  startDate: string;
  endDate: string;
  user: User;
}

interface User {
  _id: string;
  username: string;
  email: string;
  vacationDays: Vacation[];
}

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");
  const [selectedSquad, setSelectedSquad] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/login");
    } else {
      fetchSprints();
      fetchSquads();
    }
  }, [status, router]);

  async function fetchSprints() {
    try {
      const response = await fetch("/api/sprints");
      const data = await response.json();
      console.log('Fetched Sprints:', data);
      setSprints(data.data);
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  }

  async function fetchSquads() {
    try {
      const response = await fetch("/api/squads");
      const data = await response.json();
      console.log('Fetched Squads:', data);
      setSquads(data.data);
    } catch (error) {
      console.error('Error fetching squads:', error);
    }
  }

  async function fetchUsersAndVacations() {
    if (selectedSquad) {
      setLoading(true);
      try {
        console.log(`Fetching users for squad ${selectedSquad}...`);

        // Fetch users
        const usersResponse = await fetch(`/api/users?squadId=${selectedSquad}`);
        const usersData = await usersResponse.json();
        console.log('Fetched Users:', usersData);

        const userIds = usersData.data.map((user: User) => user._id);

        // Fetch vacations
        const vacationsResponse = await fetch(`/api/vacations?userIds=${userIds.join(',')}`);
        const vacationsData = await vacationsResponse.json();
        console.log('Fetched Vacations:', vacationsData);

        // Map vacations to users
        const usersWithVacations = usersData.data.map((user: User) => {
          const userVacations = vacationsData.data.filter((vacation: Vacation) => vacation.user && vacation.user._id === user._id);
          return { ...user, vacationDays: userVacations };
        });

        console.log('Users with Vacations:', usersWithVacations);
        setUsers(usersWithVacations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users or vacations:', error);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchUsersAndVacations();
  }, [selectedSquad]);

  const calculateVacationDays = (user: User) => {
    const sprint = sprints.find(s => s._id === selectedSprint);
    if (!sprint) return 0;

    const sprintStart = new Date(sprint.startDate);
    const sprintEnd = new Date(sprint.endDate);
    console.log(`Calculating vacation days for user ${user.username} during sprint from ${sprintStart} to ${sprintEnd}`);

    return user.vacationDays.reduce((total, vac) => {
      const vacStart = new Date(vac.startDate);
      const vacEnd = new Date(vac.endDate);
      console.log(`Vacation from ${vacStart} to ${vacEnd}`);

      if (vacEnd < sprintStart || vacStart > sprintEnd) {
        console.log('No overlap');
        return total;
      }

      const overlapStart = vacStart > sprintStart ? vacStart : sprintStart;
      const overlapEnd = vacEnd < sprintEnd ? vacEnd : sprintEnd;

      // Calculate the number of overlapping days
      const overlapDays = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
      console.log(`Overlap from ${overlapStart} to ${overlapEnd} = ${overlapDays} days`);

      return total + overlapDays;
    }, 0);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Typography variant="h5" gutterBottom>
          Select Squad and Sprint
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            label="Select Squad"
            value={selectedSquad}
            onChange={(e) => setSelectedSquad(e.target.value)}
            fullWidth
          >
            {squads.map(squad => (
              <MenuItem key={squad._id} value={squad._id}>
                {squad.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select Sprint"
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            fullWidth
            disabled={!selectedSquad}
          >
            {sprints.map(sprint => (
              <MenuItem key={sprint._id} value={sprint._id}>
                {sprint.title}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Users
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Username</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Vacation Days</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map(user => (
                          <TableRow key={user._id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{selectedSprint ? calculateVacationDays(user) : 'Select a sprint'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </div>
    </main>
  );
}
