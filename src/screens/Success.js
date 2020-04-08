import React from "react"
import {Container} from "react-bootstrap";
class Success extends React.Component {

    render() {

        return (
            <Container className={"container-design"}>
                <h5 className="text-left">Your password has been changed successfully. Please <a href={`/oamsso/logout.html?end_url=/SelfService/unauth/logout`}>logout</a> and login to the application again.</h5>
            </Container>
        );
    }
}

export default Success;