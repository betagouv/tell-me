import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PollOutlinedIcon from '@mui/icons-material/PollOutlined'
import MuiBox from '@mui/material/Box'
import MuiList from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import MuiListItemIcon from '@mui/material/ListItemIcon'
import MuiListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'

const Container = styled(MuiBox)`
  background-color: ${({ theme }) => theme.palette.background.menu};
  min-width: 16rem;
`

const Brand = styled(MuiBox)`
  align-items: center;
  color: white;
  display: flex;
  height: 4rem;
  font-size: 1.25rem;
  justify-content: center;
  position: relative;
  text-transform: uppercase;

  &:before {
    background-color: rgba(255, 255, 255, 0.3);
    bottom: 0;
    content: ' ';
    height: 1px;
    left: 1rem;
    position: absolute;
    width: calc(100% - 2rem);
  }
`

const List = styled(MuiList)`
  padding: 0.75rem 0 0;
`

const ListItem = styled(MuiListItem)`
  background-color: transparent !important;
  color: ${({ selected }) => (selected ? '#F3BB45' : 'white')};
  opacity: ${({ selected }) => (selected ? 1 : 0.7)};
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;

  :hover {
    opacity: 1;
  }
`

const ListItemIcon = styled(MuiListItemIcon)`
  color: inherit;
  min-width: auto;
`
const ListItemText = styled(MuiListItemText)`
  padding-left: 1rem;

  .MuiTypography-root {
    font-size: 0.8125rem;
    font-weight: 700;
  }
`

export default function Menu() {
  const location = useLocation()

  return (
    <Container>
      <Brand>Tell Me</Brand>
      <List>
        <ListItem button component={Link} selected={location.pathname === '/'} to="/">
          <ListItemIcon>
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} selected={location.pathname.startsWith('/survey')} to="/surveys">
          <ListItemIcon>
            <PollOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Surveys" />
        </ListItem>

        <ListItem button component={Link} selected={location.pathname.startsWith('/user')} to="/users">
          <ListItemIcon>
            <PeopleOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      </List>
    </Container>
  )
}
