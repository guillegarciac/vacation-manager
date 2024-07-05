'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box, MenuItem, TextField, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import styles from "./page.module.css";

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
  const { data: session, status } = useSession();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");
  const [selectedSquad, setSelectedSquad] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchInitialData();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [sprintRes, squadRes] = await Promise.all([
        fetch('/api/sprints'),
        fetch('/api/squads')
      ]);
      const sprintsData = await sprintRes.json();
      const squadsData = await squadRes.json();

      setSprints(sprintsData.data);
      setSquads(squadsData.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSquad) {
      fetchUsersAndVacations();
    }
  }, [selectedSquad]);

  async function fetchUsersAndVacations() {
    setLoading(true);
    try {
      const usersResponse = await fetch(`/api/users?squadId=${selectedSquad}`);
      const usersData = await usersResponse.json();
      const userIds = usersData.data.map((user: User) => user._id);
      const vacationsResponse = await fetch(`/api/vacations?userIds=${userIds.join(',')}`);
      const vacationsData = await vacationsResponse.json();

      const usersWithVacations = usersData.data.map((user: User) => ({
        ...user,
        vacationDays: vacationsData.data.filter((vacation: Vacation) => vacation.user._id === user._id)
      }));

      setUsers(usersWithVacations);
    } catch (error) {
      console.error('Error fetching users or vacations:', error);
    }
    setLoading(false);
  }

  const calculateVacationDays = (user: User) => {
    const sprint = sprints.find(s => s._id === selectedSprint);
    if (!sprint) return 0;
    const sprintStart = new Date(sprint.startDate);
    const sprintEnd = new Date(sprint.endDate);
    return user.vacationDays.reduce((total, vac) => {
      const vacStart = new Date(vac.startDate);
      const vacEnd = new Date(vac.endDate);
      if (vacEnd < sprintStart || vacStart > sprintEnd) return total;
      const overlapStart = vacStart > sprintStart ? vacStart : sprintStart;
      const overlapEnd = vacEnd < sprintEnd ? vacEnd : sprintEnd;
      return total + Number(overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    }, 0);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Typography variant="h5" gutterBottom>Select Squad and Sprint</Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            label="Select Squad"
            value={selectedSquad}
            onChange={(e) => setSelectedSquad(e.target.value)}
            fullWidth>
            {squads.map(squad => <MenuItem key={squad._id} value={squad._id}>{squad.name}</MenuItem>)}
          </TextField>
          <TextField
            select
            label="Select Sprint"
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            fullWidth
            disabled={!selectedSquad}>
            {sprints.map(sprint => <MenuItem key={sprint._id} value={sprint._id}>{sprint.title}</MenuItem>)}
          </TextField>
        </Box>
        {loading ? <CircularProgress /> : (
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">Users</Typography>
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
