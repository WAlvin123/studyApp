import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div class='navbar'>
      <Link to={'/'}>HOME</Link>
      <Link to={'/matching'}>STUDY: MATCHING</Link>
      <Link to={'/matching'}>STUDY: UNIMPLEMENTED</Link>
      <Link to={'/matching'}>STUDY: UNIMPLEMENTED</Link>
    </div>
  )
}