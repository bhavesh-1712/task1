import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'
import { createStyles, Select, Table, ScrollArea, Stack, Container, Button, Modal, TextInput, Group, Center, ActionIcon, Flex } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';
import { useForm } from '@mantine/form';
import { useToggle, upperFirst } from '@mantine/hooks';
import axios from 'axios';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

// interface TableScrollAreaProps {
//   data: { name: string; email: string; company: string }[];
// }

export function Dashboard() {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [students, setStudents] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);
  const [type, setToggle] = useToggle(['add', 'edit']);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:9000/students/', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (response.data) {
          // alert("Login Successful");
          // Router.push('/dashboard')
          setStudents(response.data)
        }
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [refreshKey])

  const rows = students.map((row) => (
    <tr key={row._id}>
      <td>{row.name}</td>
      <td>{row.prn_no}</td>
      <td>{row.branch}</td>
      <td>{row.year}</td>
      <td >
        <Flex
          gap="md"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap">
          <ActionIcon color={'blue'} variant="filled" onClick={() => editStudent(row)}><IconPencil size={16} /></ActionIcon>
          <ActionIcon color={'red'} variant="filled" onClick={() => deleteStudent(row._id)}><IconTrash size={16} /></ActionIcon>
        </Flex>
      </td>
    </tr>
  ));

  const form = useForm({
    initialValues: {
      name: '',
      prn_no: '',
      branch: '',
      year: true,
    },
  });

  const openAddStdForm = () => {
    setOpened(true)
    form.values.name = ''
    form.values.prn_no = ''
    form.values.branch = ''
    form.values.year = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (type == 'add') {
      axios
        .post('http://localhost:9000/students/', {
          name: event.currentTarget.name.value,
          prn_no: event.currentTarget.prn_no.value,
          branch: event.currentTarget.branch.value,
          year: event.currentTarget.year.value
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          if (response.data) {
            alert("Student Added Successfully");
            setRefreshKey(oldKey => oldKey + 1)
            setOpened(false)
          }
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios
        .put('http://localhost:9000/students/', {
          name: event.currentTarget.name.value,
          prn_no: event.currentTarget.prn_no.value,
          branch: event.currentTarget.branch.value,
          year: event.currentTarget.year.value
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          if (response.data) {
            alert("Student Updated Successfully");
            setRefreshKey(oldKey => oldKey + 1)
            setOpened(false)
          }
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  const editStudent = (std) => {
    // alert("Edit Click "+id)
    setOpened(true)
    setToggle('edit')
    form.values.name = std.name
    form.values.prn_no = std.prn_no
    form.values.branch = std.branch
    form.values.year = std.year
  }

  const deleteStudent = (id) => {
    axios
      .delete('http://localhost:9000/students/' + id, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (response.data) {
          alert("Student Deleted Successfully");
          setRefreshKey(oldKey => oldKey - 1)
        }
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }


  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={upperFirst(type) + ' Student'}
      >
        <form name='student_form' onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              name='name'
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            />

            <TextInput
              required
              label="PRN No."
              placeholder="22222222"
              value={form.values.prn_no}
              name='prn_no'
              onChange={(event) => form.setFieldValue('prn_no', event.currentTarget.value)}
              error={form.errors.prn_no && 'Invalid PRN No.'}
            />

            <Select
              required
              label="Select Branch"
              name='branch'
              value={form.values.branch}
              placeholder="Select"
              data={[
                { value: 'Civil Engineering', label: 'Civil Engineering' },
                { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
                { value: 'Chemical Engineering', label: 'Chemical Engineering' },
                { value: 'Electrical Engineering', label: 'Electrical Engineering' },
                { value: 'Computer Engineering', label: 'Computer Engineering' },
                { value: 'Information Technology', label: 'Information Technology' },
              ]}
            />

            <Select
              required
              label="Select Year"
              name='year'
              value={form.values.year}
              placeholder="Select"
              data={[
                { value: 'FY', label: 'First Year' },
                { value: 'SY', label: 'Second Year' },
                { value: 'TY', label: 'Third Year' },
                { value: 'BTech', label: 'Final Year' },
              ]}
            />

          </Stack>

          <Group position="center" mt="xl">
            <Button type="submit">{upperFirst(type) + ' Student'}</Button>
          </Group>
        </form>
      </Modal>
      <main className={styles.main}>
        <Button
          variant="light"
          radius="xl"
          size="md"
          styles={{
            root: { paddingRight: 14, height: 48 },
            rightIcon: { marginLeft: 22 },
          }}
          onClick={() => openAddStdForm()}
        >
          Add Student
        </Button>
        <Container style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          <ScrollArea sx={{ height: 300 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table sx={{ minWidth: 700 }}>
              <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                <tr>
                  <th>Name</th>
                  <th>PRN No.</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </Container>
      </main >
    </>
  );
}

// function Dashboard(){
//   return <h1>Dashboard</h1>
// }

export default Dashboard