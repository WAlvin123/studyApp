import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div class='navbar'>
      <Link to={'/studyApp'} style={{color:'white', textDecoration:'none'}}>HOME</Link>
      <Link to={'/matching'} style={{color:'white', textDecoration:'none'}}>STUDY: MATCHING</Link>
      <Link to={'/shortanswer'} style={{color:'white', textDecoration:'none'}}>STUDY: SHORT ANSWER</Link>
      <Link to={'/testing'} style={{color:'white', textDecoration:'none'}}>STUDY: UNIMPLEMENTED</Link>
    </div>
  )
}