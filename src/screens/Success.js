import React from "react"
import {Container} from "react-bootstrap";
class Success extends React.Component {

    render() {

        return (
            <Container className={"container-design"}>
                <h5 className="text-left">Your data saved successfully.</h5>
            </Container>
        );
    }
}

export default Success;