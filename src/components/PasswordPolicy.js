import React, { Fragment } from 'react';
import '../App.css';
import { GoCheck, GoX } from "react-icons/go";
import { IconContext } from "react-icons";

function PasswordPolicy(props) {
	return (
		<Fragment>
			<div>
				<h5 className="p-0">Password Policy</h5>
				{/* {console.log(props.password)} */}
				<ul>
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must not match or contain first name.</li>
							:
							props.password.toUpperCase().includes(props.familyName.toUpperCase()) ?
								<li className='red-list' style={props.style}>Password must not match or contain first name.  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must not match or contain first name.  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must not match or contain last name.</li>
							:
							props.password.toUpperCase().includes(props.givenName.toUpperCase()) ?
								<li className='red-list' style={props.style}>Password must not match or contain last name.  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must not match or contain last name.  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must contain at least 2 alphabetic character(s).</li>
							:
							!/(.*[a-zA-Z]){2,}/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must contain at least 2 alphabetic character(s).  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must contain at least 2 alphabetic character(s).  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must be at least 8 character(s) long.</li>
							:
							props.password.length < 8 ?
								<li className='red-list' style={props.style}>Password must be at least 8 character(s) long.  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must be at least 8 character(s) long.  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must contain at least 1 lowercase letter(s).</li>
							:
							!/(.*[a-z]){1,}/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must contain at least 1 lowercase letter(s).  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must contain at least 1 lowercase letter(s).  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must contain at least numeric character(s).</li>
							:
							!/(.*[0-9]){1,}/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must contain at least numeric character(s).  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must contain at least numeric character(s).  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must contain at least 1 special character(s).</li>
							:
							!/(.*[$#@^$!%*?&]){1,}/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must contain at least 1 special character(s).  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must contain at least 1 special character(s).  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must not contain @ symbol.</li>
							:
							/(.*[@]){1,}/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must not contain @ symbol.  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must not contain @ symbol.  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must contain at least 1 uppercase letter(s).</li>
							:
							!/(.*[A-Z]){1,}/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must contain at least 1 uppercase letter(s).  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must contain at least 1 uppercase letter(s).  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					<li style={props.style}>Password must not be one of 6 previous password.</li>
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must start with an alphabetic character.</li>
							:
							!/^[a-zA-Z]/.test(props.password) ?
								<li className='red-list' style={props.style}>Password must start with an alphabetic character.  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must start with an alphabetic character.  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					{
						props.password.length === 0 ?
							<li style={props.style}>Password must not match or contain user ID.</li>
							:
							props.password.toUpperCase().includes(props.userName.toUpperCase()) ?
								<li className='red-list' style={props.style}>Password must not match or contain user ID.  <IconContext.Provider value={{ color: "red" }}><GoX /></IconContext.Provider></li>
								:
								<li className='green-list' style={props.style}>Password must not match or contain user ID.  <IconContext.Provider value={{ color: "green" }}><GoCheck /></IconContext.Provider></li>
					}
					<li style={props.style}>Password cannot be changed for 3 days after the last password change.</li>
					<li className='bold-text' style={props.style}>For example: h#P9yw0rk</li>
				</ul>
			</div>
		</Fragment>
	)
}

export default PasswordPolicy;